import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      shortcuts.forEach(({ keys, action, ctrl: needCtrl, shift: needShift, alt: needAlt }) => {
        if (
          keys.includes(key) &&
          ctrl === !!needCtrl &&
          shift === !!needShift &&
          alt === !!needAlt
        ) {
          e.preventDefault();
          action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Preset shortcuts
export const SHORTCUTS = {
  SEARCH: { keys: ['k'], ctrl: true, description: 'Поиск' },
  NEW_TASK: { keys: ['n'], ctrl: true, description: 'Новая задача' },
  SAVE: { keys: ['s'], ctrl: true, description: 'Сохранить' },
  CLOSE: { keys: ['escape'], description: 'Закрыть' },
  HELP: { keys: ['?'], shift: true, description: 'Помощь' }
};
