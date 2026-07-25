import { useState, useEffect } from 'react';
import {
  getGrammarEnabled,
  setGrammarEnabled,
  getGrammarServerUrl,
  setGrammarServerUrl,
  getGrammarLanguage,
  setGrammarLanguage,
} from '../../utils/storage';

const LANGUAGES = [
  { code: 'en-US', name: 'English (United States)' },
  { code: 'en-GB', name: 'English (United Kingdom)' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'de-DE', name: 'German' },
  { code: 'fr-FR', name: 'French' },
  { code: 'es-ES', name: 'Spanish' },
];

export default function GrammarSettings() {
  const [enabled, setEnabled] = useState(true);
  const [serverUrl, setServerUrl] = useState('');
  const [language, setLanguage] = useState('zh-CN');

  useEffect(() => {
    async function loadSettings() {
      setEnabled(await getGrammarEnabled());
      setServerUrl(await getGrammarServerUrl());
      setLanguage(await getGrammarLanguage());
    }
    loadSettings();
  }, []);

  const handleEnabledChange = async (checked: boolean) => {
    setEnabled(checked);
    await setGrammarEnabled(checked);
  };

  const handleServerUrlChange = async () => {
    await setGrammarServerUrl(serverUrl.trim());
    alert('服务器地址已保存');
  };

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    await setGrammarLanguage(lang);
  };

  return (
    <div className="grammar-settings">
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
          />
          <span>启用语法拼写检查</span>
        </label>
        <p className="description">
          优先使用 <strong>纯浏览器端 ONNX 中文纠错模型</strong>，需要联网下载模型文件（~100MB），完全离线运行。<br />
          如果模型加载失败，会自动回退到 LanguageTool。
        </p>
      </div>

      <div className="setting-item">
        <label>
          <span>LanguageTool 服务器地址（备选 fallback）</span>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            onBlur={handleServerUrlChange}
            placeholder="http://localhost:8081"
          />
        </label>
        <p className="description">
          如何本地部署 LanguageTool: 请参考官方文档 <a href="https://github.com/languagetool-org/languagetool" target="_blank" rel="noopener noreferrer">languagetool-org/languagetool</a>
          <br />
          使用 Docker 可以快速启动: <code>docker run -d -p 8081:8080 languagetool-org/languagetool</code>
        </p>
      </div>

      <div className="setting-item">
        <label>
          <span>检查语言</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
        <p className="description">
          纯前端 ONNX 模型默认优化简体中文。
        </p>
      </div>
    </div>
  );
}
