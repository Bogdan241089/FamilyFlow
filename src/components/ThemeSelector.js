import React, { useState } from 'react';
import { FaPalette } from 'react-icons/fa';
import './ThemeSelector.css';

const THEMES = [
  { id: 'default', name: 'Зелёный', primary: '#4caf50', secondary: '#8bc34a' },
  { id: 'blue', name: 'Синий', primary: '#2196f3', secondary: '#03a9f4' },
  { id: 'purple', name: 'Фиолетовый', primary: '#9c27b0', secondary: '#ba68c8' },
  { id: 'orange', name: 'Оранжевый', primary: '#ff9800', secondary: '#ffb74d' },
  { id: 'red', name: 'Красный', primary: '#f44336', secondary: '#ef5350' },
  { id: 'teal', name: 'Бирюзовый', primary: '#009688', secondary: '#26a69a' }
];

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  const applyTheme = (theme) => {
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--primary-dark', theme.secondary);
    setCurrentTheme(theme.id);
    localStorage.setItem('app-theme', theme.id);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      const theme = THEMES.find(t => t.id === savedTheme);
      if (theme) applyTheme(theme);
    }
  }, []);

  return (
    <div className="theme-selector">
      <button className="theme-selector-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaPalette />
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">Выберите тему</div>
          {THEMES.map(theme => (
            <div
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => applyTheme(theme)}
            >
              <div className="theme-preview" style={{ background: theme.primary }}></div>
              <span>{theme.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;
