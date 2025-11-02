import React, { useState } from 'react';
import { FaDownload, FaUpload } from 'react-icons/fa';
import { exportBackup, importBackup } from '../services/backupService';
import { db } from '../firebase/config';
import './BackupRestore.css';

function BackupRestore({ familyId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setLoading(true);
    const result = await exportBackup(familyId, db);
    setMessage(result.message);
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('Восстановление данных перезапишет текущие данные. Продолжить?')) {
      return;
    }

    setLoading(true);
    const result = await importBackup(file, familyId, db);
    setMessage(result.message);
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="backup-restore">
      <h3>Резервное копирование</h3>
      <div className="backup-actions">
        <button onClick={handleExport} disabled={loading}>
          <FaDownload /> Экспорт данных
        </button>
        <label className="import-btn">
          <FaUpload /> Импорт данных
          <input type="file" accept=".json" onChange={handleImport} disabled={loading} />
        </label>
      </div>
      {message && <div className="backup-message">{message}</div>}
    </div>
  );
}

export default BackupRestore;
