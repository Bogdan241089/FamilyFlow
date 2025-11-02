import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaRegCalendarAlt, FaShoppingCart, FaHome, FaUsers, FaUser, FaTrophy, FaChartBar, FaComments } from 'react-icons/fa';
import './NavBar.css';

const NavBar = memo(function NavBar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/home', icon: <FaHome />, label: 'Главная' },
    { path: '/tasks', icon: <FaTasks />, label: 'Задачи' },
    { path: '/calendar', icon: <FaRegCalendarAlt />, label: 'Календарь' },
    { path: '/chat', icon: <FaComments />, label: 'Чат' },
    { path: '/shopping', icon: <FaShoppingCart />, label: 'Покупки' },
    { path: '/family', icon: <FaUsers />, label: 'Семья' },
    { path: '/achievements', icon: <FaTrophy />, label: 'Достижения' },
    { path: '/analytics', icon: <FaChartBar />, label: 'Аналитика' },
    { path: '/profile', icon: <FaUser />, label: 'Профиль' }
  ];
  
  return (
    <nav className="navbar">
      {navItems.map(item => (
        <Link 
          key={item.path}
          to={item.path} 
          className={location.pathname === item.path ? 'active' : ''}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
});

export default NavBar;
