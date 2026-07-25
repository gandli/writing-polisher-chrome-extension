import { createRoot } from 'react-dom/client';
import CorrectorSettings from '../../../src/components/CorrectorSettings';
import '../../../src/styles/options.css';

const Options = () => {
  return (
    <div className="options-container">
      <header>
        <h1>pycorrector 中文纠错</h1>
        <p>纯浏览器端中文拼写纠错，基于 ONNX Runtime Web，完全离线运行</p>
      </header>

      <main>
        <CorrectorSettings />
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<Options />);
