import React from 'react';
import './ChallengeCard.css';

function ChallengeCard({ challenge, onAccept }) {
  const progress = challenge.progress || 0;
  const percentage = Math.min((progress / challenge.requirement) * 100, 100);

  return (
    <div className="challenge-card fade-in">
      <div className="challenge-icon">{challenge.icon}</div>
      <div className="challenge-content">
        <h3>{challenge.name}</h3>
        <p>{challenge.desc}</p>
        
        <div className="challenge-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
          <span className="progress-text">{progress}/{challenge.requirement}</span>
        </div>

        <div className="challenge-footer">
          <div className="challenge-reward">
            🏆 {challenge.reward} очков
          </div>
          <div className="challenge-duration">
            ⏰ {challenge.duration === 'daily' ? 'Сегодня' : 'Эта неделя'}
          </div>
        </div>

        {!challenge.active && onAccept && (
          <button onClick={() => onAccept(challenge.id)} className="accept-btn">
            Принять вызов
          </button>
        )}
      </div>
    </div>
  );
}

export default ChallengeCard;
