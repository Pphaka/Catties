import React, { useState } from 'react';
import './Profile.css';
import Navbar from '../components/Navbar';
import { Camera, Edit2, Plus, Send } from 'lucide-react';

export default function Profile() {
  const [activeItem, setActiveItem] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Karen',
    bio: '🌿 เที่ยวให้สุด แล้วหยุดที่รู้สลวย ๆ และรอยยิ้ม...',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=300&fit=crop'
  });
  const [tempProfile, setTempProfile] = useState({...profile});
  const [newComment, setNewComment] = useState('');

  const handleSaveProfile = () => {
    setProfile({...tempProfile});
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setTempProfile({...profile});
    setIsEditingProfile(false);
  };

  return (
    <div className="app-container">
      <Navbar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brand="TGT"
      />

      {/* Cover */}
      <div className="cover-image">
        <img src={profile.coverImage} alt="Cover" />
        <div className="cover-overlay"></div>
        <div className="cover-actions">
          <label>
            <Camera />
            เปลี่ยนปก
            <input type="file" hidden />
          </label>
          <button>
            <Plus /> สร้างโพสต์
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          <img src={tempProfile.avatar} alt="Avatar" />
          <label className="avatar-edit">
            <Camera />
            <input type="file" hidden />
          </label>
        </div>
        {isEditingProfile ? (
          <input
            type="text"
            value={tempProfile.name}
            onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
          />
        ) : (
          <h2>{profile.name}</h2>
        )}
        {isEditingProfile ? (
          <textarea
            value={tempProfile.bio}
            onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
            rows={4}
          />
        ) : (
          <p>{profile.bio}</p>
        )}
        {isEditingProfile && (
          <div className="profile-buttons">
            <button onClick={handleSaveProfile}>บันทึก</button>
            <button onClick={handleCancelEdit}>ยกเลิก</button>
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="comments-card">
        <input
          type="text"
          placeholder="เขียนความคิดเห็น..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button><Send /></button>
      </div>
    </div>
  );
}
