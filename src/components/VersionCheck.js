import React, { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';
import './VersionCheck.css';

const CURRENT_VERSION = '1.0.0';

function VersionCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkVersion = () => {
      const stored = localStorage.getItem('app-version');
      if (stored && stored !== CURRENT_VERSION) {
        setUpdateAvailable(true);
      }
      localStorage.setItem('app-version', CURRENT_VERSION);
    };

    checkVersion();
  }, []);

  const handleUpdate = () => {
    window.location.reload(true);
  };

  if (!updateAvailable) return null;

  return (
    <div className="version-check">
      <div className="version-content">
        <FaSync className="spin" />
        <div>
          <strong>Доступно обновление!</strong>
          <p>Новая версия FamilyFlow готова к установке</p>
        </div>
        <button onClick={handleUpdate}>Обновить</button>
      </div>
    </div>
  );
}

export default VersionCheck;
