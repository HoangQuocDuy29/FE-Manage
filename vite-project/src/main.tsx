import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ✅ bọc App trong BrowserRouter */}
      <App />
    
  </StrictMode>
);
