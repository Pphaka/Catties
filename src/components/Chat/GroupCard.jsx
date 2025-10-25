import React from 'react';
import { MessageCircle } from 'lucide-react';

const GroupCard = ({ group, onChatClick }) => {
  return (
    <div className={`group-card ${group.unread > 0 ? 'unread' : ''}`}>
      <div className="group-avatar-container">
        <img src={group.avatar} alt={group.name} className="group-avatar" />
        {group.unread > 0 && <div className="unread-badge">{group.unread}</div>}
      </div>
      <div className="group-info">
        <h3 className={`group-name ${group.unread > 0 ? 'unread' : ''}`}>
          {group.name}
        </h3>
        <p className={`group-description ${group.unread > 0 ? 'unread' : ''}`}>
          {group.description}
        </p>
        <p className="group-date">{group.date}</p>
      </div>
      <button className="chat-btn" onClick={() => onChatClick(group.id)}>
        <MessageCircle size={18} />
        <span>Chat</span>
      </button>
    </div>
  );
};

export default GroupCard;