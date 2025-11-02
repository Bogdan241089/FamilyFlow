import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button className="language-toggle" onClick={toggleLanguage} title="Change language">
      {language === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
    </button>
  );
}

export default LanguageToggle;
