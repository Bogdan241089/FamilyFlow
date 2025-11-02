import React from 'react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { FaSync } from 'react-icons/fa';
import './PullToRefresh.css';

function PullToRefresh({ onRefresh, children }) {
  const { isPulling, pullDistance } = usePullToRefresh(onRefresh);

  return (
    <>
      <div 
        className={`pull-indicator ${isPulling ? 'active' : ''}`}
        style={{ transform: `translateY(${Math.min(pullDistance, 80)}px)` }}
      >
        <FaSync className={isPulling ? 'spinning' : ''} />
        <span>{isPulling ? 'Отпустите для обновления' : 'Потяните для обновления'}</span>
      </div>
      {children}
    </>
  );
}

export default PullToRefresh;
