import React, { useRef } from 'react';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { dataExportService } from '../services/dataExportService';
import { useToast } from './Toast';
import './DataExportImport.css';

export default function DataExportImport({ familyData, onImport }) {
  const fileInputRef = useRef();
  const toast = useToast();

  const handleExport = async () => {
    try {
      await dataExportService.exportToJSON(familyData);
      toast.success('Данные экспортированы');
    } catch (error) {
      toast.error('Ошибка экспорта');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await dataExportService.importFromJSON(file);
      onImport(data);
      toast.success('Данные импортированы');
    } catch (error) {
      toast.error('Неверный формат файла');
    }
  };

  return (
    <div className="data-export-import">
      <button onClick={handleExport} className="btn-export">
        <FiDownload /> Экспорт данных
      </button>
      <button onClick={() => fileInputRef.current?.click()} className="btn-import">
        <FiUpload /> Импорт данных
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </div>
  );
}
