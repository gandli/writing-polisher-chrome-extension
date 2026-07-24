import { useState, useEffect } from 'react';
import { getAllDictionaryEntries } from '../../utils/dictionary';
import { getCustomDictionary, setCustomDictionary } from '../../utils/storage';
import { DictionaryEntry } from '../../types';

export default function DictionaryManager() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [newColloquial, setNewColloquial] = useState('');
  const [newFormal, setNewFormal] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    setLoading(true);
    const allEntries = await getAllDictionaryEntries();
    setEntries(allEntries);
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleAdd = async () => {
    if (!newColloquial.trim() || !newFormal.trim()) {
      alert('请填写完整信息');
      return;
    }
    const custom = await getCustomDictionary();
    custom[newColloquial.trim()] = newFormal.trim();
    await setCustomDictionary(custom);
    setNewColloquial('');
    setNewFormal('');
    await loadEntries();
  };

  const handleDelete = async (entry: DictionaryEntry) => {
    if (!entry.isCustom) {
      alert('内置词条不能删除');
      return;
    }
    if (!confirm(`确定要删除词条 "${entry.colloquial}" 吗？`)) {
      return;
    }
    const custom = await getCustomDictionary();
    delete custom[entry.colloquial];
    await setCustomDictionary(custom);
    await loadEntries();
  };

  const handleExport = async () => {
    const merged = entries.reduce(
      (acc, entry) => {
        acc[entry.colloquial] = entry.formal;
        return acc;
      },
      {} as Record<string, string>
    );
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'writing-polisher-dictionary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const current = await getCustomDictionary();
        const merged = { ...current, ...imported };
        await setCustomDictionary(merged);
        alert('导入成功！');
        await loadEntries();
      } catch (err) {
        alert('导入失败，请检查JSON格式');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="dictionary-manager">
      <div className="add-form">
        <input
          type="text"
          placeholder="口语化表达"
          value={newColloquial}
          onChange={(e) => setNewColloquial(e.target.value)}
        />
        <input
          type="text"
          placeholder="专业表达"
          value={newFormal}
          onChange={(e) => setNewFormal(e.target.value)}
        />
        <button onClick={handleAdd}>添加</button>
      </div>

      <div className="action-buttons">
        <button onClick={handleExport}>导出词典</button>
        <label>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          导入词典
        </label>
      </div>

      {loading ? (
        <div className="empty">加载中...</div>
      ) : entries.length === 0 ? (
        <div className="empty">暂无词条</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>口语化表达</th>
              <th>专业表达</th>
              <th>类型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.colloquial}>
                <td>{entry.colloquial}</td>
                <td>{entry.formal}</td>
                <td>
                  <span className={`badge ${entry.isCustom ? 'custom' : ''}`}>
                    {entry.isCustom ? '自定义' : '内置'}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry)}
                    disabled={!entry.isCustom}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
