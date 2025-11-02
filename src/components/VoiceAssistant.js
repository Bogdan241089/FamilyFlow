import React, { useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { startVoiceRecognition, speak } from '../services/voiceService';
import { parseVoiceCommand } from '../services/aiService';
import { parseSimpleVoiceCommand } from '../services/voiceCommandParser';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Toast from './Toast';

function VoiceAssistant() {
  const { currentUser } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [toast, setToast] = useState(null);
  const [recognition, setRecognition] = useState(null);

  async function handleVoiceCommand(voiceText) {
    setTranscript(voiceText);
    speak('Обрабатываю команду');
    
    if (!currentUser) {
      speak('Войдите в систему');
      setToast({ message: 'Требуется авторизация', type: 'error' });
      return;
    }
    
    try {
      let command;
      
      // Пробуем ИИ, если не получилось - используем простой парсер
      try {
        command = await parseVoiceCommand(voiceText);
      } catch (aiError) {
        console.log('ИИ недоступен, использую простой парсер');
        command = parseSimpleVoiceCommand(voiceText);
      }
      
      if (!command) {
        speak('Не удалось распознать команду');
        setToast({ message: 'Не удалось распознать команду', type: 'error' });
        return;
      }

      const profile = await getProfile(currentUser.uid);
      const familyId = profile?.defaultFamilyId;
      
      if (!familyId) {
        speak('Сначала создайте семью');
        setToast({ message: 'Создайте семью', type: 'error' });
        return;
      }

      // Выполняем действие в зависимости от команды
      if (command.action === 'shopping' && command.data.items) {
        // Добавляем товары в список покупок
        for (const item of command.data.items) {
          await addDoc(collection(db, `families/${familyId}/shopping`), {
            name: item,
            qty: '',
            bought: false,
            createdAt: serverTimestamp()
          });
        }
        speak(command.response || `Добавлено ${command.data.items.length} товаров в список покупок`);
        setToast({ message: `Добавлено ${command.data.items.length} товаров`, type: 'success' });
      } 
      else if (command.action === 'task') {
        // Создаём задачу
        await addDoc(collection(db, `families/${familyId}/tasks`), {
          title: command.data.title,
          desc: command.data.description || '',
          datetime: serverTimestamp(),
          priority: command.data.priority || 'medium',
          category: command.data.category || 'other',
          assignee: currentUser.uid,
          responsible: currentUser.uid,
          showFor: [currentUser.uid],
          color: '#4caf50',
          done: false,
          confirmed: false,
          createdBy: currentUser.uid,
          createdAt: serverTimestamp()
        });
        speak(command.response || 'Задача создана');
        setToast({ message: 'Задача создана', type: 'success' });
      }
      else if (command.action === 'calendar') {
        // Создаём событие в календаре
        await addDoc(collection(db, `families/${familyId}/calendar`), {
          title: command.data.title,
          date: serverTimestamp(),
          description: command.data.description || '',
          color: '#4caf50',
          createdBy: currentUser.uid,
          createdAt: serverTimestamp()
        });
        speak(command.response || 'Событие добавлено в календарь');
        setToast({ message: 'Событие добавлено', type: 'success' });
      }
      else {
        speak(command.response || 'Команда выполнена');
        setToast({ message: command.response, type: 'success' });
      }
      
    } catch (error) {
      console.error('Voice command error:', error);
      speak('Произошла ошибка');
      setToast({ message: 'Ошибка выполнения команды', type: 'error' });
    }
  }

  function startListening() {
    const rec = startVoiceRecognition(
      (text) => {
        setIsListening(false);
        handleVoiceCommand(text);
      },
      (error) => {
        setIsListening(false);
        setToast({ message: error, type: 'error' });
      }
    );
    
    if (rec) {
      setRecognition(rec);
      setIsListening(true);
      speak('Слушаю');
    }
  }

  function stopListening() {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <button
        onClick={isListening ? stopListening : startListening}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isListening ? '#f44336' : '#9c27b0',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: 1000,
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
        title={isListening ? 'Остановить' : 'Голосовая команда'}
      >
        {isListening ? <FaStop /> : <FaMicrophone />}
      </button>

      {transcript && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          maxWidth: '300px',
          zIndex: 999
        }}>
          <strong>Вы сказали:</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>{transcript}</p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}

export default VoiceAssistant;
