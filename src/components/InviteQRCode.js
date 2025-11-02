import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateInviteCode } from '../services/inviteService';
import { getProfile } from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';
import './InviteQRCode.css';
import { FaQrcode, FaCopy, FaCheck } from 'react-icons/fa';

function InviteQRCode({ familyId, role = 'child' }) {
  const { currentUser } = useAuth();
  const [inviteCode, setInviteCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCode = async () => {
    setLoading(true);
    try {
      const { code } = await generateInviteCode(familyId, currentUser.uid, role);
      const inviteUrl = `${window.location.origin}/invite/${code}`;
      setInviteCode({ code, url: inviteUrl });
    } catch (error) {
      console.error('Ошибка генерации кода:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="invite-qr-container">
      <h3><FaQrcode /> Пригласить {role === 'child' ? 'ребёнка' : role === 'grandparent' ? 'бабушку/дедушку' : 'члена семьи'}</h3>
      
      {!inviteCode ? (
        <button onClick={generateCode} disabled={loading} className="generate-btn">
          {loading ? 'Генерация...' : 'Создать QR-код'}
        </button>
      ) : (
        <div className="qr-display fade-in">
          <div className="qr-code-wrapper">
            <QRCodeSVG value={inviteCode.url} size={200} level="H" />
          </div>
          
          <div className="invite-info">
            <p className="invite-code">Код: <strong>{inviteCode.code}</strong></p>
            <p className="invite-hint">Отсканируйте QR-код или используйте код для регистрации</p>
            
            <button onClick={copyToClipboard} className="copy-btn">
              {copied ? <><FaCheck /> Скопировано</> : <><FaCopy /> Копировать ссылку</>}
            </button>
            
            <button onClick={generateCode} className="regenerate-btn">
              Создать новый код
            </button>
          </div>
        </div>
      )}
      
      <p className="qr-note">⚠️ Код одноразовый и действителен 7 дней</p>
    </div>
  );
}

export default InviteQRCode;
