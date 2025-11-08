import React, { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Edit, Trash2, Send, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './PostCard.css';

const PostCard = ({
  post,
  currentUser,
  likedPosts,
  showComments,
  commentInputs,
  toggleLike,
  toggleComments,
  handleCommentInput,
  addComment,
  handleJoinChat,
  showDropdown,
  setShowDropdown,
  handleOpenEditModal,
  deletePost
}) => {
  const isFull = post.currentMembers >= post.maxMembers;
  
  // State สำหรับ Image Viewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // เปิด Image Viewer
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden'; // ป้องกัน scroll
  };

  // ปิด Image Viewer
  const closeImageViewer = () => {
    setIsViewerOpen(false);
    document.body.style.overflow = 'auto';
  };

  // รูปถัดไป
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  // รูปก่อนหน้า
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  // จัดการ keyboard navigation
  const handleKeyDown = (e) => {
    if (!isViewerOpen) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeImageViewer();
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen, currentImageIndex]);

  return (
    <>
      <div className="post-card">
        {/* Header */}
        <div className="post-header">
          <div className="post-author">
            <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
            <div className="author-info">
              <h3>{post.author.name}</h3>
              <p>{post.timestamp}</p>
            </div>
          </div>
          {post.isOwner && (
            <div className="dropdown">
              <button className="dropdown-btn" onClick={() => setShowDropdown(showDropdown === post.id ? null : post.id)}>
                <MoreVertical />
              </button>
              {showDropdown === post.id && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => handleOpenEditModal(post)}>
                    <Edit size={16} /> แก้ไข
                  </button>
                  <button className="dropdown-item delete" onClick={() => deletePost(post.id)}>
                    <Trash2 size={16} /> ลบ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {post.title && <h2 className="post-title">{post.title}</h2>}
        {post.content && <p className="post-content">{post.content}</p>}

        {/* Image Gallery - คลิกได้ */}
        {post.images && post.images.length > 0 && (
          <div className={`post-image-gallery images-${Math.min(post.images.length, 5)}`}>
            {post.images.slice(0, 4).map((imageUrl, index) => (
              <img 
                key={index} 
                src={imageUrl} 
                alt={`post content ${index + 1}`}
                onClick={() => openImageViewer(index)}
              />
            ))}
            {post.images.length > 4 && (
              <div 
                className="more-images-overlay"
                onClick={() => openImageViewer(3)}
              >
                +{post.images.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="post-actions">
          <button
            className={`action-btn ${likedPosts.has(post.id) ? 'liked' : ''}`}
            onClick={() => toggleLike(post.id)}
          >
            <Heart fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
            <span>{post.likes}</span>
          </button>
          <button className="action-btn" onClick={() => toggleComments(post.id)}>
            <MessageCircle />
            <span>{post.comments.length}</span>
          </button>
        </div>

        {/* Join Section */}
        <div className="post-join-section">
          <div className={`post-member-count ${isFull ? 'full' : ''}`}>
            {post.currentMembers}/{post.maxMembers} คน
            {isFull && ' - เต็มแล้ว!'}
          </div>
          <button
            className="join-now-btn"
            onClick={() => handleJoinChat(post.id, post.chatGroupId)}
            disabled={isFull}
          >
            {isFull ? '❌ กลุ่มเต็มแล้ว' : 'เข้าร่วมเลย (Join Now)'}
          </button>
        </div>

        {/* Comments */}
        {showComments.has(post.id) && (
          <div className="comments-section">
            <div className="comments-list">
              {post.comments.map((comment, idx) => (
                <div key={idx} className="comment">
                  <strong>{comment.author}</strong>
                  <p>{comment.text}</p>
                  {comment.timestamp && <span className="comment-time">{comment.timestamp}</span>}
                </div>
              ))}
            </div>
            <div className="comment-input-wrapper">
              <input
                type="text"
                placeholder="เขียนความคิดเห็น..."
                value={commentInputs[post.id] || ''}
                onChange={(e) => handleCommentInput(post.id, e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                className="comment-input"
              />
              <button
                className="send-comment-btn"
                onClick={() => addComment(post.id)}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {isViewerOpen && post.images && (
        <div className="image-viewer-overlay" onClick={closeImageViewer}>
          <button className="viewer-close" onClick={closeImageViewer}>
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          {post.images.length > 1 && (
            <>
              <button 
                className="viewer-nav viewer-prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft size={40} />
              </button>
              <button 
                className="viewer-nav viewer-next" 
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          {/* Current Image */}
          <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={post.images[currentImageIndex]} 
              alt={`Image ${currentImageIndex + 1}`}
            />
            <div className="viewer-counter">
              {currentImageIndex + 1} / {post.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;