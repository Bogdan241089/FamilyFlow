import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaTasks, FaCalendar, FaShoppingCart, FaUser } from 'react-icons/fa';
import { globalSearch } from '../services/searchService';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import './GlobalSearch.css';

function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [familyId, setFamilyId] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFamily() {
      if (currentUser) {
        const profile = await getProfile(currentUser.uid);
        setFamilyId(profile?.defaultFamilyId);
      }
    }
    loadFamily();
  }, [currentUser]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    async function search() {
      if (!familyId || query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const searchResults = await globalSearch(familyId, query);
      setResults(searchResults);
      setLoading(false);
    }
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query, familyId]);

  const getIcon = (type) => {
    switch (type) {
      case 'task': return <FaTasks color="#4caf50" />;
      case 'event': return <FaCalendar color="#2196f3" />;
      case 'shopping': return <FaShoppingCart color="#ff9800" />;
      case 'member': return <FaUser color="#9c27b0" />;
      default: return <FaSearch />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'task': return 'Задача';
      case 'event': return 'Событие';
      case 'shopping': return 'Покупка';
      case 'member': return 'Участник';
      default: return '';
    }
  };

  const handleResultClick = (result) => {
    switch (result.type) {
      case 'task':
        navigate('/tasks');
        break;
      case 'event':
        navigate('/calendar');
        break;
      case 'shopping':
        navigate('/shopping');
        break;
      case 'member':
        navigate('/family');
        break;
      default:
        break;
    }
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) {
    return (
      <button className="search-trigger" onClick={() => setIsOpen(true)}>
        <FaSearch /> <span>Поиск</span>
        <kbd>Ctrl+K</kbd>
      </button>
    );
  }

  return (
    <div className="search-overlay" onClick={() => setIsOpen(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по задачам, событиям, покупкам..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="search-results">
          {loading && <div className="search-loading">Поиск...</div>}
          
          {!loading && query.length > 0 && query.length < 2 && (
            <div className="search-hint">Введите минимум 2 символа</div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="search-empty">Ничего не найдено</div>
          )}

          {!loading && results.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="search-result-item"
              onClick={() => handleResultClick(result)}
            >
              <div className="result-icon">{getIcon(result.type)}</div>
              <div className="result-content">
                <div className="result-title">{result.title}</div>
                <div className="result-meta">
                  <span className="result-type">{getTypeLabel(result.type)}</span>
                  {result.description && <span className="result-desc">{result.description}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="search-footer">
          <kbd>↑↓</kbd> навигация
          <kbd>Enter</kbd> выбрать
          <kbd>Esc</kbd> закрыть
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
