import React from 'react';
import { Users } from 'lucide-react';
import GroupCard from './GroupCard';

const GroupList = ({ 
  groups, 
  searchTerm, 
  onSearchChange, 
  onChatClick, 
  onCreateGroup 
}) => {
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <button onClick={onCreateGroup} className="create-group-btn">
          <Users size={20} />
          <span>สร้างกลุ่ม</span>
        </button>
      </div>

      <div className="group-header">
        <input
          type="text"
          placeholder="ค้นหากลุ่ม..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="group-search"
        />
      </div>

      <div className="groups-list">
        {groups.length > 0 ? (
          groups.map(group => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onChatClick={onChatClick} 
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <p className="empty-state-text">ไม่พบกลุ่มที่คุณค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;