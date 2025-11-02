import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaRegCalendarAlt, FaShoppingCart, FaHome, FaBars, FaTimes, FaUser, FaMoon, FaSun, FaTrophy, FaRobot, FaWallet, FaComments, FaUsers } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  function handleToggle() {
    setOpen(!open);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <button className="sidebar-hamburger" onClick={handleToggle}>
        {open ? <FaTimes /> : <FaBars />}
      </button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <nav>
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''} onClick={handleClose}>
            <FaHome /> Главная
          </Link>
          <Link to="/tasks" className={location.pathname === '/tasks' ? 'active' : ''} onClick={handleClose}>
            <FaTasks /> Задачи
          </Link>
          <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''} onClick={handleClose}>
            <FaRegCalendarAlt /> Календарь
          </Link>
          <Link to="/shopping" className={location.pathname === '/shopping' ? 'active' : ''} onClick={handleClose}>
            <FaShoppingCart /> Покупки
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={handleClose}>
            <FaUser /> Профиль
          </Link>
          <Link to="/family" className={location.pathname === '/family' ? 'active' : ''} onClick={handleClose}>
            <FaUsers /> Семья
          </Link>
          <Link to="/achievements" className={location.pathname === '/achievements' ? 'active' : ''} onClick={handleClose}>
            <FaTrophy /> Достижения
          </Link>
          <Link to="/ai" className={location.pathname === '/ai' ? 'active' : ''} onClick={handleClose}>
            <FaRobot /> ИИ Помощник
          </Link>
          <Link to="/budget" className={location.pathname === '/budget' ? 'active' : ''} onClick={handleClose}>
            <FaWallet /> Бюджет
          </Link>
          <Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''} onClick={handleClose}>
            <FaComments /> Чат
          </Link>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: darkMode ? '#e0e0e0' : '#333', cursor: 'pointer', padding: '1rem', textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Светлая' : 'Темная'}
          </button>
        </nav>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={handleClose}></div>}
    </>
  );
}

export default Sidebar;
