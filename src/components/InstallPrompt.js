import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import './InstallPrompt.css';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt fade-in">
      <button className="close-btn" onClick={() => setShowPrompt(false)}>
        <FaTimes />
      </button>
      <div className="install-icon">
        <FaDownload size={40} />
      </div>
      <h3>Установить приложение?</h3>
      <p>Добавьте FamilyFlow на главный экран для быстрого доступа</p>
      <button onClick={handleInstall} className="install-btn">
        Установить
      </button>
    </div>
  );
}

export default InstallPrompt;
