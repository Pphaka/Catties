import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, X, Check, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Post from '../components/Post';  
import Feb from '../components/Feb'; // ✅ เพิ่ม import Feb กลับมา
import './ProfilePage.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Karen',
    bio: '🌿 เที่ยวให้สุด แล้วชุดกีรุ๊ปน้อย ๆ และรองยีน ตะลอกรีก ภูเก็ตจิ วิวจากน่อน คาเฟ่โในพลาด 🐱 ชอบเดินทางแบบชิลล์ล ๆ แต่หัวใจตื่อล้ายสุย พร้อมเห็บทุกความประหน่ไอโชในทกครังท่องเดินทาง',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    coverColor: 'linear-gradient(135deg, #a8d5e2 0%, #f9d5a5 100%)'
  });

  const [editForm, setEditForm] = useState({ ...profileData });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const coverOptions = [
    'linear-gradient(135deg, #a8d5e2 0%, #f9d5a5 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ];

  const reviews = {
    average: 4.6,
    total: 128,
    breakdown: [
      { stars: 5, count: 90 },
      { stars: 4, count: 25 },
      { stars: 3, count: 10 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 }
    ]
  };

  const comments = [
    {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
      text: 'เป็นเพื่อนร่วมทริปที่เก่งมากๆ เป็นกันเองสุดๆ'
    },
    {
      id: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
      text: 'จัดทริปได้ดีมาก ๆ สนุกทุกจุดเลย 💕'
    }
  ];

  const renderStars = (count) => '⭐'.repeat(count) + '☆'.repeat(5 - count);

  return (
    <div className="head">
      <Navbar brand="TripTogether" />
      <div className="hero-section" style={{ background: profileData.coverColor }}></div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">แก้ไขโปรไฟล์</h2>
              <button onClick={handleCancel} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">รูปโปรไฟล์</label>
              <div className="profile-image-upload-wrapper">
                <div className="profile-avatar-preview">
                  <img src={editForm.avatar} alt="Profile" className="avatar-img" />
                </div>
                <label className="image-upload-label">
                  <Camera size={16} />
                  เลือกรูปภาพ
                  <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">ชื่อ</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="text-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ความสนใจ</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={5}
                className="textarea-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">สีพื้นหลังหน้าปก</label>
              <div className="cover-color-grid">
                {coverOptions.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleChange('coverColor', color)}
                    className={`color-option-btn ${editForm.coverColor === color ? 'selected' : ''}`}
                    style={{ background: color }}
                  >
                    {editForm.coverColor === color && (
                      <div className="color-select-check">
                        <Check size={20} color="#667eea" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleCancel} className="secondary-btn">ยกเลิก</button>
              <button onClick={handleSave} className="primary-btn">บันทึก</button>
            </div>
          </div>
        </div>
      )}

      <div className="content-wrapper">
        <div className="profile-card">
          <div className="profile-card-content">
            <div className="avatar-section">
              <div className="profile-avatar-large">
                <img src={profileData.avatar} alt="Profile" className="avatar-img" />
              </div>
              <button onClick={handleEdit} className="edit-avatar-btn">
                <Camera size={18} />
              </button>
            </div>

            <div className="profile-info">
              <div className="profile-header">
                <h2 className="profile-name">{profileData.name}</h2>
                <button onClick={handleEdit} className="primary-btn edit-profile-btn">
                  <Edit2 size={16} /> แก้ไขโปรไฟล์
                </button>
              </div>
              <div className="bio-box">
                <h3 className="bio-title">ความสนใจ</h3>
                <p className="bio-text">{profileData.bio}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div>
            <div className="content-box">
              <h3 className="section-title">Post</h3>
              {/*ใช้ Post component แทน PostCard */}
                <Post 
                    currentUser={{ name: profileData.name, avatar: profileData.avatar }}
                    searchTerm=""
                    filterByOwner={true}  
                    ownerId={profileData.name}  
              />
            </div>
          </div>

          <div className="right-column-container">
            <div className="content-box">
              <h3 className="section-title">Review</h3>
              <div className="review-summary">
                <div className="review-average">{reviews.average}</div>
                <div className="review-total">{reviews.total} ratings</div>
              </div>
              <div className="review-breakdown">
                {reviews.breakdown.map((item) => (
                  <div key={item.stars} className="review-bar-row">
                    <div className="review-stars">{renderStars(item.stars)}</div>
                    <div className="review-bar-container">
                      <div
                        className="review-bar-fill"
                        style={{
                          width: `${(item.count / reviews.total) * 100}%`,
                          backgroundColor: item.count > 0 ? '#4caf50' : '#f0f0f0'
                        }}
                      />
                    </div>
                    <div className="review-count">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-box">
              <h3 className="section-title">Comment 💬</h3>
              <div className="comment-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      <img src={comment.avatar} alt="User" className="avatar-img" />
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;