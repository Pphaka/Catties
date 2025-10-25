import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Endtrip.css';

const Endtrip = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('review');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showTripReviewPopup, setShowTripReviewPopup] = useState(false);
  const [showFriendReviewPopup, setShowFriendReviewPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    images: []
  });
  const [friendRatings, setFriendRatings] = useState({});
  const [friendComments, setFriendComments] = useState({});
  const [posts, setPosts] = useState([]);
  const [reviewedGroups, setReviewedGroups] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const groups = [
    {
      id: 1,
      name: 'Nomad Collective',
      location: 'Phuket Trip',
      image: '🏖️',
      friends: [
        { id: 1, name: 'สมชาย', avatar: '👨' },
        { id: 2, name: 'สมหญิง', avatar: '👩' },
        { id: 3, name: 'อนุชา', avatar: '🧑' }
      ]
    },
    {
      id: 2,
      name: 'Latitude Lovers',
      location: 'NakhonNayok Trip',
      image: '🏔️',
      friends: [
        { id: 4, name: 'ดาว', avatar: '👧' },
        { id: 5, name: 'เดือน', avatar: '👨' }
      ]
    },
    {
      id: 3,
      name: 'Escapade Society',
      location: 'Bangsaen Trip',
      image: '🌊',
      friends: [
        { id: 6, name: 'พลอย', avatar: '👩' },
        { id: 7, name: 'กิต', avatar: '👨' },
        { id: 8, name: 'แนน', avatar: '👧' }
      ]
    }
  ];

  const handleStarClick = (rating) => {
    setReviewData({ ...reviewData, rating });
  };

  const handleFriendRating = (friendId, rating) => {
    setFriendRatings({ ...friendRatings, [friendId]: rating });
  };

  const handleFriendComment = (friendId, comment) => {
    setFriendComments({ ...friendComments, [friendId]: comment });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setReviewData({ ...reviewData, images: [...reviewData.images, ...imageUrls] });
  };

  const handleRemoveImage = (index) => {
    const newImages = reviewData.images.filter((_, i) => i !== index);
    setReviewData({ ...reviewData, images: newImages });
  };

  const handleSubmitReview = () => {
    if (!selectedGroup || reviewData.rating === 0) {
      alert('กรุณาให้คะแนนทริป');
      return;
    }

    if (isEditing && editingPostId) {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === editingPostId 
          ? {
              ...post,
              rating: reviewData.rating,
              comment: reviewData.comment,
              images: reviewData.images,
              date: new Date().toLocaleDateString('th-TH')
            }
          : post
      ));
      alert('แก้ไขรีวิวสำเร็จ!');
    } else {
      // Create new post
      const newPost = {
        id: Date.now(),
        groupId: selectedGroup.id,
        groupName: selectedGroup.name,
        location: selectedGroup.location,
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images,
        date: new Date().toLocaleDateString('th-TH')
      };

      setPosts([newPost, ...posts]);
      
      // Mark group as reviewed
      if (!reviewedGroups.includes(selectedGroup.id)) {
        setReviewedGroups([...reviewedGroups, selectedGroup.id]);
      }
      
      alert('โพสรีวิวสำเร็จ!');
    }
    
    // TODO: ส่งข้อมูล friendRatings และ friendComments ไปเก็บที่ Profile ของเพื่อนแต่ละคน
    // ข้อมูลที่จะส่ง: friendRatings, friendComments
    
    // Reset form and close popups
    setReviewData({ rating: 0, comment: '', images: [] });
    setFriendRatings({});
    setFriendComments({});
    setSelectedGroup(null);
    setShowTripReviewPopup(false);
    setShowFriendReviewPopup(false);
    setIsEditing(false);
    setEditingPostId(null);
    
    // Switch to Feed tab
    setActiveTab('feed');
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setIsEditing(false);
    setEditingPostId(null);
    setShowTripReviewPopup(true);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('คุณต้องการลบรีวิวนี้ใช่หรือไม่?')) {
      const post = posts.find(p => p.id === postId);
      setPosts(posts.filter(p => p.id !== postId));
      
      // Remove from reviewed groups
      setReviewedGroups(reviewedGroups.filter(id => id !== post.groupId));
      
      setOpenMenuId(null);
      alert('ลบรีวิวสำเร็จ!');
    }
  };

  const handleEditPost = (post) => {
    const group = groups.find(g => g.id === post.groupId);
    setSelectedGroup(group);
    setReviewData({
      rating: post.rating,
      comment: post.comment,
      images: post.images
    });
    setIsEditing(true);
    setEditingPostId(post.id);
    setShowTripReviewPopup(true);
    setActiveTab('review');
    setOpenMenuId(null);
  };

  const toggleMenu = (postId) => {
    setOpenMenuId(openMenuId === postId ? null : postId);
  };

  const handleNextToFriendReview = () => {
    if (reviewData.rating === 0) {
      alert('กรุณาให้คะแนนทริป');
      return;
    }
    setShowTripReviewPopup(false);
    setShowFriendReviewPopup(true);
  };

  const handleBackToTripReview = () => {
    setShowFriendReviewPopup(false);
    setShowTripReviewPopup(true);
  };

  const handleClosePopups = () => {
    setShowTripReviewPopup(false);
    setShowFriendReviewPopup(false);
    setSelectedGroup(null);
    setReviewData({ rating: 0, comment: '', images: [] });
    setFriendRatings({});
    setFriendComments({});
    setIsEditing(false);
    setEditingPostId(null);
  };

  const StarRating = ({ rating, onRate, size = 30 }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${!onRate ? 'readonly' : ''}`}
            onClick={() => onRate && onRate(star)}
            style={{
              fontSize: `${size}px`,
              color: star <= rating ? '#FFD700' : '#ddd'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="endtrip-container">
      {/* Navbar */}
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brand="TripTogether"
      />

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          รีวิวทริป
        </button>
        <button 
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          Feed
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'review' ? (
          <>
            {/* Group Selection */}
            <div>
              {groups.map((group) => (
                <div 
                  key={group.id}
                  className="group-card"
                  onClick={() => handleGroupClick(group)}
                >
                  <div className="group-avatar">{group.image}</div>
                  <div className="group-info">
                    <div className="group-name">Name Group : {group.name}</div>
                    <div className="group-location">{group.location}</div>
                  </div>
                  {reviewedGroups.includes(group.id) ? (
                    <div className="status-badge">รีวิวแล้ว</div>
                  ) : (
                    <button className="review-button">Review</button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Feed Tab */
          <div>
            {posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <div className="empty-state-text">ยังไม่มีรีวิว<br/>เริ่มต้นรีวิวทริปของคุณได้เลย!</div>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-avatar">🎒</div>
                    <div className="post-info">
                      <div className="post-group-name">{post.groupName}</div>
                      <div className="post-location">{post.location}</div>
                      <div className="post-date">{post.date}</div>
                    </div>
                    <div style={{ marginRight: '40px' }}>
                      <StarRating rating={post.rating} size={30} />
                    </div>
                    
                    {/* Three-dot menu */}
                    <button 
                      className="menu-button"
                      onClick={() => toggleMenu(post.id)}
                    >
                      ⋮
                    </button>
                    
                    {/* Dropdown menu */}
                    {openMenuId === post.id && (
                      <div className="menu-dropdown">
                        <button 
                          className="menu-item"
                          onClick={() => handleEditPost(post)}
                        >
                          <span>แก้ไข</span>
                        </button>
                        <button 
                          className="menu-item delete"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <span>ลบ</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="post-content">
                    {post.comment && (
                      <>
                        <div className="post-comment">{post.comment}</div>
                      </>
                    )}
                    
                    {post.images.length > 0 && (
                      <div className="post-images">
                        {post.images.map((image, index) => (
                          <img 
                            key={index} 
                            src={image} 
                            alt={`Trip ${index + 1}`} 
                            className="post-image"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Trip Review Popup */}
      {showTripReviewPopup && selectedGroup && (
        <div className="popup-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) handleClosePopups();
        }}>
          <div className="popup">
            <div className="popup-header">
              <h2 className="popup-title">
                {isEditing ? 'แก้ไขรีวิวทริป' : 'รีวิวทริป'}: {selectedGroup.name}
              </h2>
              <button 
                className="close-button"
                onClick={handleClosePopups}
              >
                ×
              </button>
            </div>

            <div className="popup-content">
              {/* Trip Rating */}
              <div>
                <h3 className="section-title">ให้คะแนนทริป</h3>
                <div className="rating-display">
                  <StarRating rating={reviewData.rating} onRate={handleStarClick} size={40} />
                  <span className="rating-text">
                    {reviewData.rating > 0 ? `${reviewData.rating}/5` : 'กรุณาให้คะแนน'}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div style={{ marginTop: '25px' }}>
                <h3 className="section-title">แชร์ประสบการณ์ของคุณ</h3>
                <textarea
                  placeholder="เล่าเรื่องราวดีๆ จากทริปของคุณ..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="textarea"
                />
              </div>

              {/* Image Upload */}
              <div style={{ marginTop: '25px' }}>
                <h3 className="section-title">เพิ่มรูปภาพ</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="imageUploadPopup"
                />
                <label htmlFor="imageUploadPopup" className="image-upload-button" style={{ cursor: 'pointer' }}>
                  📷 เพิ่มรูปภาพ
                </label>

                {reviewData.images.length > 0 && (
                  <div className="image-preview-container">
                    {reviewData.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image} alt={`Preview ${index + 1}`} className="preview-image" />
                        <button
                          className="remove-image-button"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="popup-footer">
              <button 
                className="secondary-button"
                onClick={handleClosePopups}
              >
                ยกเลิก
              </button>
              <button 
                className="primary-button"
                onClick={handleNextToFriendReview}
              >
                {isEditing ? 'ถัดไป' : 'ถัดไป: รีวิวเพื่อน'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friend Review Popup */}
      {showFriendReviewPopup && selectedGroup && (
        <div className="popup-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) handleClosePopups();
        }}>
          <div className="popup">
            <div className="popup-header">
              <h2 className="popup-title">รีวิวเพื่อนร่วมทริป</h2>
              <button 
                className="close-button"
                onClick={handleClosePopups}
              >
                ×
              </button>
            </div>

            <div className="popup-content">
              <h3 className="section-title">ให้คะแนนและรีวิวเพื่อนร่วมทริป</h3>
              {selectedGroup.friends.map((friend) => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-card-header">
                    <div className="friend-info">
                      <div className="friend-avatar">{friend.avatar}</div>
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>{friend.name}</span>
                    </div>
                    <StarRating 
                      rating={friendRatings[friend.id] || 0} 
                      onRate={(rating) => handleFriendRating(friend.id, rating)}
                      size={25}
                    />
                  </div>
                  <textarea
                    placeholder={`เขียนรีวิวให้ ${friend.name}...`}
                    value={friendComments[friend.id] || ''}
                    onChange={(e) => handleFriendComment(friend.id, e.target.value)}
                    className="friend-comment-textarea"
                  />
                </div>
              ))}
            </div>

            <div className="popup-footer">
              <button 
                className="secondary-button"
                onClick={handleBackToTripReview}
              >
                ย้อนกลับ
              </button>
              <button 
                className="primary-button success"
                onClick={handleSubmitReview}
              >
                {isEditing ? 'บันทึกการแก้ไข' : 'โพสรีวิว'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Endtrip;