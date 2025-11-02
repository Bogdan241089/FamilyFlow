import React, { useEffect, useState } from 'react';

function PointsAnimation({ points, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#ffc107',
      zIndex: 9999,
      animation: 'pointsFloat 2s ease-out',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      pointerEvents: 'none'
    }}>
      +{points} 🏆
      <style>{`
        @keyframes pointsFloat {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -70%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -100%) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default PointsAnimation;
