import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import DictionaryManager from '../../../src/components/DictionaryManager';
import LawsManager from '../../../src/components/LawsManager';
import '../../../src/styles/options.css';

const Options = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'laws'>('dictionary');

  return (
    <div className="options-container">
      <header>
        <h1>Writing Polisher 设置</h1>
        <p>管理词典和法条，完全离线存储</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'dictionary' ? 'active' : ''}`}
          onClick={() => setActiveTab('dictionary')}
        >
          词典管理
        </button>
        <button
          className={`tab ${activeTab === 'laws' ? 'active' : ''}`}
          onClick={() => setActiveTab('laws')}
        >
          法条管理
        </button>
      </div>

      <main>
        {activeTab === 'dictionary' && <DictionaryManager />}
        {activeTab === 'laws' && <LawsManager />}
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<Options />);
