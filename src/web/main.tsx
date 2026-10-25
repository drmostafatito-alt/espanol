import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// خط Cairo محلي (يُبنى مع الحزمة — لا طلبات خطوط خارجية، متوافق مع CSP: font-src 'self')
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/500.css';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/700.css';
import '@fontsource/cairo/800.css';
import './styles.css';

const el = document.getElementById('root');
if (!el) throw new Error('root element missing');
createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
