import React, { memo } from 'react';

const Spinner = memo(function Spinner({ size = 'md', inline = false }) {
  const sizes = {
    sm: { width: '20px', height: '20px', border: '3px' },
    md: { width: '40px', height: '40px', border: '4px' },
    lg: { width: '60px', height: '60px', border: '5px' }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        display: inline ? 'inline-flex' : 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: inline ? 'auto' : '200px'
      }}>
        <div style={{
          width: currentSize.width,
          height: currentSize.height,
          border: `${currentSize.border} solid rgba(76, 175, 80, 0.2)`,
          borderTop: `${currentSize.border} solid #4caf50`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    </>
  );
});

export default Spinner;
