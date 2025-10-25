import React from 'react';

const MessageBubble = ({ message }) => {
  return (
    <div className={`message-wrapper ${message.isOwn ? 'own' : ''}`}>
      <div className={`message-bubble ${message.isOwn ? 'own' : ''}`}>
        {!message.isOwn && <div className="message-sender">{message.sender}</div>}
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
        {message.type === 'location' && message.location && (
          <div style={{ marginTop: '8px' }}>
            <a
              href={`https://www.google.com/maps?q=${message.location.lat},${message.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: message.isOwn ? '#bbdefb' : '#1976d2',
                textDecoration: 'underline'
              }}
            >
              เปิดใน Google Maps
            </a>
          </div>
        )}
        <div className="message-time">{message.time}</div>
      </div>
    </div>
  );
};

export default MessageBubble;