import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Security: Add Content Security Policy
if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.supabase.co";
  document.head.appendChild(cspMeta);
}

// Security: Prevent clickjacking
if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
  const xfoMeta = document.createElement('meta');
  xfoMeta.httpEquiv = 'X-Frame-Options';
  xfoMeta.content = 'DENY';
  document.head.appendChild(xfoMeta);
}

// Security: Prevent MIME type sniffing
if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
  const xctoMeta = document.createElement('meta');
  xctoMeta.httpEquiv = 'X-Content-Type-Options';
  xctoMeta.content = 'nosniff';
  document.head.appendChild(xctoMeta);
}

// Security: Set strict Referrer Policy
if (!document.querySelector('meta[name="referrer"]')) {
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = 'strict-origin-when-cross-origin';
  document.head.appendChild(referrerMeta);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);