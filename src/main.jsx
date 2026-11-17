import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  const pageMarkup = document.getElementById('site-content')?.innerHTML ?? '';

  useEffect(() => {
    // Keep existing GSAP, Lenis, and UI interactions attached after React mounts the page.
    import('../script.js');
  }, []);

  return (
    <div
      className="min-h-screen antialiased"
      dangerouslySetInnerHTML={{ __html: pageMarkup }}
    />
  );
}

createRoot(document.getElementById('root')).render(<App />);
