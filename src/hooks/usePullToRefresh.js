import { useEffect, useRef, useState } from 'react';

export function usePullToRefresh(onRefresh) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && startY.current > 0) {
        const distance = e.touches[0].clientY - startY.current;
        if (distance > 0) {
          setPullDistance(Math.min(distance, threshold * 1.5));
          setIsPulling(distance > threshold);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && pullDistance > threshold) {
        await onRefresh();
      }
      setPullDistance(0);
      setIsPulling(false);
      startY.current = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, onRefresh]);

  return { isPulling, pullDistance };
}
