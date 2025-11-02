import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTasks, FaCalendar, FaShoppingCart, FaComments, FaTimes } from 'react-icons/fa';
import './QuickActions.css';

function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: <FaTasks />, label: 'Задача', path: '/tasks', color: '#4caf50' },
    { icon: <FaCalendar />, label: 'Событие', path: '/calendar', color: '#2196f3' },
    { icon: <FaShoppingCart />, label: 'Покупка', path: '/shopping', color: '#ff9800' },
    { icon: <FaComments />, label: 'Сообщение', path: '/chat', color: '#9c27b0' }
  ];

  const handleAction = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className={`quick-actions-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaPlus />}
      </button>

      {isOpen && (
        <div className="quick-actions-menu">
          {actions.map((action, index) => (
            <button
              key={index}
              className="quick-action-item"
              style={{ 
                background: action.color,
                animationDelay: `${index * 0.05}s`
              }}
              onClick={() => handleAction(action.path)}
              title={action.label}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && <div className="quick-actions-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default QuickActions;
