import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowRight } from 'react-icons/fa';
import './WelcomeTour.css';

const TOUR_STEPS = [
  {
    title: 'Добро пожаловать в FamilyFlow! 👋',
    description: 'Умный органайзер для всей семьи. Давайте познакомимся с основными функциями.',
    target: null
  },
  {
    title: 'Быстрые действия ⚡',
    description: 'Нажмите на кнопку + внизу справа для быстрого создания задач, событий и покупок.',
    target: '.quick-actions-btn'
  },
  {
    title: 'Глобальный поиск 🔍',
    description: 'Нажмите Ctrl+K для быстрого поиска по всему приложению.',
    target: '.search-trigger'
  },
  {
    title: 'Горячие клавиши ⌨️',
    description: 'Нажмите ? для просмотра всех горячих клавиш.',
    target: null
  },
  {
    title: 'Готово! 🎉',
    description: 'Теперь вы готовы использовать FamilyFlow. Приятной работы!',
    target: null
  }
];

function WelcomeTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('tour-completed');
    if (!tourCompleted) {
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsActive(false);
    localStorage.setItem('tour-completed', 'true');
  };

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      <div className="tour-overlay" onClick={handleClose} />
      <div className="tour-tooltip">
        <button className="tour-close" onClick={handleClose}>
          <FaTimes />
        </button>
        <h3>{step.title}</h3>
        <p>{step.description}</p>
        <div className="tour-footer">
          <div className="tour-progress">
            {currentStep + 1} / {TOUR_STEPS.length}
          </div>
          <button className="tour-next" onClick={handleNext}>
            {currentStep < TOUR_STEPS.length - 1 ? (
              <>Далее <FaArrowRight /></>
            ) : (
              'Начать'
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default WelcomeTour;
