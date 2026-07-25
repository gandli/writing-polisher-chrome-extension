import { useState, useEffect } from 'react';
import { getAllLawEntries } from '../utils/laws';
import { getCustomLaws, setCustomLaws } from '../utils/storage';
import { LawEntry } from '../types';

export default function LawsManager() {
  const [entries, setEntries] = useState<LawEntry[]>([]);
  const [newName, setNewName] = useState('');
  const [newArticle, setNewArticle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    setLoading(true);
    const allEntries = await getAllLawEntries();
    setEntries(allEntries);
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim() || !newArticle.trim() || !newContent.trim()) {
      alert('请填写完整信息');
      return;
    }
    const custom = await getCustomLaws();
    if (!custom[newName.trim()]) {
      custom[newName.trim()] = {};
    }
    custom[newName.trim()][newArticle.trim()] = newContent.trim();
    await setCustomLaws(custom);
    setNewName('');
    setNewArticle('');
    setNewContent('');
    await loadEntries();
  };

  const handleDelete = async (entry: LawEntry) => {
    if (!entry.isCustom) {
      alert('内置法条不能删除');
      return;
    }
    if (!confirm(`确定要删除 ${entry.name} 第${entry.article}条吗？`)) {
      return;
    }
    const custom = await getCustomLaws();
    if (custom[entry.name]) {
      delete custom[entry.name][entry.article];
      // Remove empty law
      if (Object.keys(custom[entry.name]).length === 0) {
        delete custom[entry.name];
      }
    }
    await setCustomLaws(custom);
    await loadEntries();
  };

  const handleExport = async () => {
    const merged = entries.reduce(
      (acc, entry) => {
        if (!acc[entry.name]) {
          acc[entry.name] = {};
        }
        acc[entry.name][entry.article] = entry.content;
        return acc;
      },
      {} as Record<string, Record<string, string>>
    );
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'writing-polisher-laws.json';
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
        const current = await getCustomLaws();
        // Merge imported into current
        for (const [name, articles] of Object.entries(imported)) {
          if (!current[name]) {
            current[name] = {};
          }
          Object.assign(current[name], articles);
        }
        await setCustomLaws(current);
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
    <div className="laws-manager">
      <div className="add-form">
        <input
          type="text"
          placeholder="法律名称"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="条款号"
          value={newArticle}
          onChange={(e) => setNewArticle(e.target.value)}
          style={{ maxWidth: 100 }}
        />
        <input
          type="text"
          placeholder="条款内容"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button onClick={handleAdd}>添加</button>
      </div>

      <div className="action-buttons">
        <button onClick={handleExport}>导出法条</button>
        <label>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          导入法条
        </label>
      </div>

      {loading ? (
        <div className="empty">加载中...</div>
      ) : entries.length === 0 ? (
        <div className="empty">暂无法条</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>法律名称</th>
              <th>条款</th>
              <th>内容</th>
              <th>类型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={`${entry.name}-${entry.article}`}>
                <td>{entry.name}</td>
                <td>{entry.article}</td>
                <td>{entry.content.length > 50 ? entry.content.slice(0, 50) + '...' : entry.content}</td>
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
