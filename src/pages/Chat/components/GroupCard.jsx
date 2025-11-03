import React from 'react';
import { MessageCircle } from 'lucide-react';

const GroupCard = ({ group, onChatClick, currentUser = 'คุณ' }) => {
  const isFull = group.currentMembers >= group.maxMembers;
  const isAlreadyMember = group.members.includes(currentUser);
  const shouldDisable = isFull && !isAlreadyMember;

  return (
    <div className={`group-card ${group.unread > 0 ? 'unread' : ''} ${isFull ? 'full' : ''}`}>
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
        <p className="member-count">
          {group.currentMembers}/{group.maxMembers} คน
          {isFull && <span className="full-badge"> (เต็ม)</span>}
        </p>
      </div>

      <button 
        className="chat-btn" 
        onClick={() => onChatClick(group.id)}
        disabled={shouldDisable}
      >
        <MessageCircle size={18} />
        <span>
          {shouldDisable ? 'เต็ม' : isAlreadyMember ? 'เปิดแชท' : 'เข้าร่วม'}
        </span>
      </button>
    </div>
  );
};

export default GroupCard;