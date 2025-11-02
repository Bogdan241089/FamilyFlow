import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/profileService';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { FaComments, FaPaperPlane } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import ThemeToggle from '../components/ThemeToggle';
import './ChatScreen.css';

function ChatScreen() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [familyId, setFamilyId] = useState(null);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadChat() {
      if (!currentUser) return;
      
      const profile = await getProfile(currentUser.uid);
      setUserName(profile?.name || 'Пользователь');
      const fid = profile?.defaultFamilyId;
      
      if (fid) {
        setFamilyId(fid);
        const q = query(
          collection(db, `families/${fid}/chat`),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs = [];
          snapshot.forEach(doc => {
            msgs.push({ id: doc.id, ...doc.data() });
          });
          setMessages(msgs.reverse());
        });
        
        return () => unsubscribe();
      }
    }
    loadChat();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !familyId || !currentUser) return;

    try {
      await addDoc(collection(db, `families/${familyId}/chat`), {
        text: newMessage,
        userId: currentUser.uid,
        userName: userName,
        createdAt: new Date().toISOString()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }
  };

  return (
    <>
      <ThemeToggle />
      <NavBar />
      <div className="chat-container">
        <h2><FaComments /> Семейный чат</h2>
        
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.userId === currentUser?.uid ? 'own' : 'other'}`}
            >
              <div className="message-author">{msg.userName}</div>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            autoFocus
          />
          <button type="submit">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatScreen;
