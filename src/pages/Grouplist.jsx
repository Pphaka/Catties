import React, { useState } from 'react';
import { Users, MessageCircle, X, Upload } from 'lucide-react';
import './Grouplist.css';
import Navbar from '../components/Navbar';

const ChatGroupPage = () => {
  const [activeItem, setActiveItem] = useState('chat');
  const [searchTerm, setSearchTerm] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupAvatar, setNewGroupAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Nomad Collective',
      avatar: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Doughnut : พรุ่งนี้เราเจอกัน 7:00 น. นะคะ',
      date: '1 May 2025',
      online: true,
      unread: 3
    },
    {
      id: 2,
      name: 'Latitude Lovers',
      avatar: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'คุม : โอเคคับบ',
      date: '30 April 2025',
      online: false,
      unread: 0
    },
    {
      id: 3,
      name: 'Escapade Society',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Emily : ตอนนี้เรามีกันกี่คนคะ ?',
      date: '28 April 2025',
      online: true,
      unread: 5
    }
  ]);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewGroupAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) { alert('กรุณาใส่ชื่อกลุ่ม'); return; }

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      avatar: avatarPreview || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: newGroupDesc || 'ยังไม่มีข้อความ',
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
      online: true,
      unread: 0
    };

    setGroups(prev => [newGroup, ...prev]);
    setIsModalOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupAvatar(null);
    setAvatarPreview(null);
  };

  const handleChatClick = (groupId) => {
    setGroups(prev => prev.map(group => group.id === groupId ? { ...group, unread: 0 } : group));
  };

  const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(groupSearch.toLowerCase()));

  return (
    <div className="app-container">
      {/* ใช้ Navbar Component */}
      <Navbar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brand="TGT"
      />

      {/* Chat Content */}
      <div className="chat-container">
        <div className="page-header">
          <button className="create-group-btn" onClick={() => setIsModalOpen(true)}>
            <Users size={20} />
            <span>Create Group</span>
          </button>
        </div>

        <div className="group-search">
          <input
            type="text"
            className="group-search-input"
            placeholder="ค้นหากลุ่ม..."
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
          />
        </div>

        <div className="groups-list">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.id} className={`group-card ${group.unread > 0 ? 'unread' : ''}`}>
                <div className="group-avatar-container">
                  <img src={group.avatar} alt={group.name} className="group-avatar" />
                  {group.unread > 0 && <div className="unread-badge">{group.unread}</div>}
                </div>
                <div className="group-info">
                  <h3 className={`group-name ${group.unread > 0 ? 'unread' : ''}`}>Name Group : {group.name}</h3>
                  <p className={`group-description ${group.unread > 0 ? 'unread' : ''}`}>{group.description}</p>
                  <p className="group-date">{group.date}</p>
                </div>
                <button className="chat-btn" onClick={() => handleChatClick(group.id)}>
                  <MessageCircle size={18} style={{ marginRight: '8px' }} />
                  Chat
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-text">ไม่พบกลุ่มที่คุณค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">สร้างกลุ่มใหม่</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">รูปโปรไฟล์กลุ่ม</label>
              <div className="avatar-upload">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="avatar-preview" />
                ) : (
                  <div className="avatar-placeholder">📸</div>
                )}
                <label className="upload-btn">
                  <Upload size={18} />
                  <span>อัปโหลดรูปภาพ</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="file-input" />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">ชื่อกลุ่ม *</label>
              <input
                type="text"
                className="form-input"
                placeholder="ใส่ชื่อกลุ่ม"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              <button className="submit-btn" onClick={handleCreateGroup} disabled={!newGroupName.trim()}>สร้างกลุ่ม</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGroupPage;
