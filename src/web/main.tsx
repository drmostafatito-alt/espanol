import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// خط Cairo محلي (يُبنى مع الحزمة — لا طلبات خطوط خارجية، متوافق مع CSP: font-src 'self')
// أوزان الخط الثلاثة المستخدمة فعليًا فقط (400/700/800) — كل وزن يُحمَّل
// عربيًا ولاتينيًا، فحذف وزنَين يوفّر ~4 ملفات و~60KB على أول زيارة.
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/700.css';
import '@fontsource/cairo/800.css';
import './styles.css';
// طبقة الهوية v2 فوق طبقة التوافق — كل التعديلات البصرية الجديدة هنا
import './theme.css';

const el = document.getElementById('root');
if (!el) throw new Error('root element missing');
createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
