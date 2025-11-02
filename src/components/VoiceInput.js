import React, { useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { startVoiceRecognition } from '../services/voiceService';
import './VoiceInput.css';

function VoiceInput({ onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const handleStart = () => {
    const rec = startVoiceRecognition(
      (text) => {
        onResult(text);
        setIsListening(false);
      },
      (error) => {
        console.error(error);
        setIsListening(false);
      }
    );
    
    if (rec) {
      setRecognition(rec);
      setIsListening(true);
    }
  };

  const handleStop = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <button
      className={`voice-input-btn ${isListening ? 'listening' : ''}`}
      onClick={isListening ? handleStop : handleStart}
      type="button"
      title={isListening ? 'Остановить запись' : 'Голосовой ввод'}
    >
      {isListening ? <FaStop /> : <FaMicrophone />}
    </button>
  );
}

export default VoiceInput;
