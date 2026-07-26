import React, { useState, useEffect } from 'react';
import { getModelUrl, getVocabUrl, setModelUrl, setVocabUrl, getEnabled, setEnabled } from '../utils/storage';

export default function CorrectorSettings() {
  const [modelUrlVal, setModelUrlVal] = useState('');
  const [vocabUrlVal, setVocabUrlVal] = useState('');
  const [enabledVal, setEnabledVal] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const [model, vocab, enabled] = await Promise.all([
        getModelUrl(),
        getVocabUrl(),
        getEnabled(),
      ]);
      setModelUrlVal(model);
      setVocabUrlVal(vocab);
      setEnabledVal(enabled);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    await Promise.all([
      setModelUrl(modelUrlVal),
      setVocabUrl(vocabUrlVal),
      setEnabled(enabledVal),
    ]);
    setSaving(false);
    setSaved(true);
    // Notify content script to refresh
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'settings-updated' });
      }
    });
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="container">
      <h1>writing-polisher Settings</h1>
      <div className="section">
        <label htmlFor="model-url">ONNX Model URL</label>
        <input
          id="model-url"
          type="text"
          value={modelUrlVal}
          onChange={(e) => setModelUrlVal(e.target.value)}
          placeholder="https://huggingface.co/..."
        />
        <p className="hint">
          Default: shibing624/mengzi-t5-base-chinese-correction ONNX model from HuggingFace
        </p>
      </div>

      <div className="section">
        <label htmlFor="vocab-url">Vocabulary URL</label>
        <input
          id="vocab-url"
          type="text"
          value={vocabUrlVal}
          onChange={(e) => setVocabUrlVal(e.target.value)}
          placeholder="https://huggingface.co/..."
        />
        <p className="hint">
          Default: vocabulary file from the same model repository
        </p>
      </div>

      <div className="section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={enabledVal}
            onChange={(e) => setEnabledVal(e.target.checked)}
          />
          <span>Enable automatic spelling correction</span>
        </label>
      </div>

      <button
        className="save-button"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>

      <style>{`
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #ffffff;
          color: #202124;
        }
        @media (prefers-color-scheme: dark) {
          .container {
            background-color: #1f2937;
            color: #f9fafb;
          }
        }
        h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        @media (prefers-color-scheme: dark) {
          h1 {
            color: #f9fafb;
            border-bottom-color: #374151;
          }
        }
        .section {
          margin-bottom: 24px;
        }
        label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }
        @media (prefers-color-scheme: dark) {
          label {
            color: #e5e7eb;
          }
        }
        input[type="text"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          background-color: #ffffff;
          color: #202124;
        }
        @media (prefers-color-scheme: dark) {
          input[type="text"] {
            background-color: #374151;
            border-color: #4b5563;
            color: #f9fafb;
          }
        }
        .hint {
          font-size: 12px;
          color: #666;
          margin-top: 6px;
        }
        @media (prefers-color-scheme: dark) {
          .hint {
            color: #9ca3afb;
          }
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }
        .save-button {
          width: 100%;
          padding: 12px;
          background-color: #1677ff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        .save-button:disabled {
          background-color: #94cfff;
          cursor: not-allowed;
        }
        @media (prefers-color-scheme: dark) {
          .save-button {
            background-color: #1677ff;
            color: white;
          }
          .save-button:disabled {
            background-color: #4a5568;
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  );
}
