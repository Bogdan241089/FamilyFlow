import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [autoTheme, setAutoTheme] = useState(() => {
    const saved = localStorage.getItem('autoTheme');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('autoTheme', JSON.stringify(autoTheme));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode, autoTheme]);

  useEffect(() => {
    if (autoTheme) {
      const checkTime = () => {
        const hour = new Date().getHours();
        const shouldBeDark = hour >= 20 || hour < 7;
        if (shouldBeDark !== darkMode) {
          setDarkMode(shouldBeDark);
        }
      };
      checkTime();
      const interval = setInterval(checkTime, 60000);
      return () => clearInterval(interval);
    }
  }, [autoTheme, darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const toggleAutoTheme = () => {
    setAutoTheme(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, autoTheme, toggleAutoTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
