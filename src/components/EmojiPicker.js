import React, { useState } from 'react';
import { FaSmile } from 'react-icons/fa';
import './EmojiPicker.css';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😊', '😍', '🥰', '😎', '🤩', '🥳',
  '👍', '👏', '🙌', '💪', '🔥', '⭐', '✨', '🎉', '🎊', '🏆',
  '❤️', '💚', '💙', '💜', '🧡', '💛', '🤍', '🖤', '💖', '💝',
  '🏠', '🏡', '🏢', '🏫', '🏥', '🏪', '🏬', '🏭', '🏗️', '🏘️',
  '🍕', '🍔', '🍟', '🍿', '🥗', '🍜', '🍱', '🍛', '🍝', '🍰',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥊', '🎯'
];

function EmojiPicker({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (emoji) => {
    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="emoji-picker">
      <button 
        type="button"
        className="emoji-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        title="Добавить эмодзи"
      >
        <FaSmile />
      </button>

      {isOpen && (
        <>
          <div className="emoji-overlay" onClick={() => setIsOpen(false)} />
          <div className="emoji-grid">
            {EMOJIS.map((emoji, index) => (
              <button
                key={index}
                type="button"
                className="emoji-item"
                onClick={() => handleSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default EmojiPicker;
