import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import { getEnabled, setEnabled } from '../../src/utils/storage';
import '../../../src/styles/popup.css';

const Popup = () => {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    getEnabled().then((val) => setEnabledState(val));
  }, []);

  const toggleEnabled = async () => {
    const newEnabled = !enabled;
    setEnabledState(newEnabled);
    await setEnabled(newEnabled);
    window.close();
  };

  return (
    <div className="popup-container">
      <h1>pycorrector 中文纠错</h1>
      <p className="description">
        纯浏览器端中文拼写纠错，基于 ONNX Runtime Web 运行 pycorrector 预训练模型。
      </p>
      <div className="setting-row">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleEnabled}
          />
          启用实时检测
        </label>
      </div>
      <div className="actions">
        <a href={chrome.runtime.getURL('options.html')} target="_blank" rel="noopener noreferrer">
          打开选项页 → 配置模型
        </a>
      </div>
      <div className="footer">
        完全离线运行，不上传任何数据
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<Popup />);
