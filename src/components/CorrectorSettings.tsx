import { useState, useEffect } from 'react';
import {
  getEnabled,
  setEnabled,
  getModelUrl,
  setModelUrl,
  getVocabUrl,
  setVocabUrl,
} from '../../utils/storage';

export default function CorrectorSettings() {
  const [enabled, setEnabledState] = useState(true);
  const [modelUrl, setModelUrlState] = useState('');
  const [vocabUrl, setVocabUrlState] = useState('');

  useEffect(() => {
    async function loadSettings() {
      setEnabledState(await getEnabled());
      setModelUrlState(await getModelUrl());
      setVocabUrlState(await getVocabUrl());
    }
    loadSettings();
  }, []);

  const handleEnabledChange = async (checked: boolean) => {
    setEnabledState(checked);
    await setEnabled(checked);
  };

  const handleModelUrlChange = async () => {
    await setModelUrl(modelUrl.trim());
    alert('模型地址已保存');
  };

  const handleVocabUrlChange = async () => {
    await setVocabUrl(vocabUrl.trim());
    alert('词表地址已保存');
  };

  return (
    <div className="corrector-settings">
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
          />
          <span>启用中文拼写纠错</span>
        </label>
        <p className="description">
          基于 pycorrector 预训练模型，使用 ONNX Runtime Web 在浏览器本地推理。<br />
          首次使用需要下载模型 (~100MB 量化版本)，下载后完全离线运行。
        </p>
      </div>

      <div className="setting-item">
        <label>
          <span>ONNX 模型 URL</span>
          <input
            type="text"
            value={modelUrl}
            onChange={(e) => setModelUrlState(e.target.value)}
            onBlur={handleModelUrlChange}
            placeholder="https://..."
          />
        </label>
        <p className="description">
          默认使用: shibing624/mengzi-t5-base-chinese-correction-onnx<br />
          你可以替换为自己转换的模型。
        </p>
      </div>

      <div className="setting-item">
        <label>
          <span>词表 URL</span>
          <input
            type="text"
            value={vocabUrl}
            onChange={(e) => setVocabUrlState(e.target.value)}
            onBlur={handleVocabUrlChange}
            placeholder="https://..."
          />
        </label>
      </div>
    </div>
  );
}
