import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './AdvancedFilters.css';

function AdvancedFilters({ onApply, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    priority: 'all',
    status: 'all',
    category: 'all'
  });

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = {
      dateRange: 'all',
      priority: 'all',
      status: 'all',
      category: 'all'
    };
    setFilters(cleared);
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="advanced-filters">
      <button className="filter-trigger" onClick={() => setIsOpen(!isOpen)}>
        <FaFilter /> Фильтры
      </button>

      {isOpen && (
        <div className="filter-modal">
          <div className="filter-header">
            <h3>Фильтры</h3>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>

          <div className="filter-group">
            <label>Период:</label>
            <select value={filters.dateRange} onChange={e => setFilters({...filters, dateRange: e.target.value})}>
              <option value="all">Все</option>
              <option value="today">Сегодня</option>
              <option value="week">Эта неделя</option>
              <option value="month">Этот месяц</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Приоритет:</label>
            <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})}>
              <option value="all">Все</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Статус:</label>
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="all">Все</option>
              <option value="pending">В работе</option>
              <option value="done">Выполнено</option>
              <option value="overdue">Просрочено</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Категория:</label>
            <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
              <option value="all">Все</option>
              <option value="home">🏠 Дом</option>
              <option value="work">💼 Работа</option>
              <option value="study">📚 Учёба</option>
              <option value="sport">⚽ Спорт</option>
              <option value="health">❤️ Здоровье</option>
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={handleClear} className="clear-btn">Сбросить</button>
            <button onClick={handleApply} className="apply-btn">Применить</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;
