import React, { useEffect } from 'react';

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getStyle = () => ({
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '6px',
    color: '#fff',
    zIndex: 1000,
    background: type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'
  });

  return (
    <div style={getStyle()}>
      {message}
    </div>
  );
}

export default Toast;