import React, { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Edit, Trash2, Send, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotifications } from "./NotificationContext";
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
  deletePost,
  approveJoinRequest,
  rejectJoinRequest
}) => {
  const { addNotification } = useNotifications();
  
  const isLeader = post.author.name === currentUser.name;
  const hasRequested = post.joinRequests?.some(r => r.userName === currentUser.name);
  const isMember = post.members?.some(m => m.userName === currentUser.name);
  const isFull = post.currentMembers >= post.maxMembers;
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleApprove = (userName) => {
    const request = post.joinRequests?.find(r => r.userName === userName);
    if (!request) return;

    approveJoinRequest(post.id, userName);

    addNotification({
      type: 'request_approved',
      postId: post.id,
      postTitle: post.title,
      from: currentUser.name,
      fromAvatar: currentUser.avatar,
      to: userName,
      message: `คำขอเข้าร่วมทริป "${post.title}" ได้รับการอนุมัติแล้ว! 🎉`
    });
  };

  const handleReject = (userName) => {
    rejectJoinRequest(post.id, userName);

    addNotification({
      type: 'request_rejected',
      postId: post.id,
      postTitle: post.title,
      from: currentUser.name,
      fromAvatar: currentUser.avatar,
      to: userName,
      message: `คำขอเข้าร่วมทริป "${post.title}" ไม่ได้รับการอนุมัติ`
    });
  };

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

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
              <h3 className="author-name">
                {post.author.name}
                {isLeader && <span className="leader-badge">Leader</span>}
              </h3>
              <p>{post.timestamp}</p>
            </div>
          </div>
          {isLeader && (
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

        {/* Body */}
        <div className="post-body">
          {post.title && <h2 className="post-title">{post.title}</h2>}
          {post.content && <p className="post-description">{post.content}</p>}

          {/* Image Gallery */}
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
        </div>

        {/* Pending Requests */}
        {isLeader && post.joinRequests && post.joinRequests.length > 0 && (
          <div className="pending-requests-section">
            <h4 className="pending-requests-title">
              🔔 คำขอเข้าร่วม ({post.joinRequests.length})
            </h4>
            <div className="pending-requests-list">
              {post.joinRequests.map((request) => (
                <div key={request.userId} className="request-item">
                  <img 
                    src={request.userAvatar} 
                    alt={request.userName}
                    className="request-avatar"
                  />
                  <div className="request-info">
                    <p className="request-name">{request.userName}</p>
                    <p className="request-time">{request.timestamp}</p>
                  </div>
                  <div className="request-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(request.userName)}
                    >
                      ✓ อนุมัติ
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(request.userName)}
                    >
                      ✕ ปฏิเสธ
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
        {!isLeader && (
          <div className="post-join-section">
            <div className={`post-member-count ${isFull ? 'full' : ''}`}>
              {post.currentMembers}/{post.maxMembers} คน
              {isFull && ' - เต็มแล้ว!'}
            </div>
            
            {isMember ? (
              <button className="join-now-btn member" disabled>
                ✓ เป็นสมาชิกแล้ว
              </button>
            ) : hasRequested ? (
              <button className="join-now-btn pending" disabled>
                ⏳ รอการอนุมัติ
              </button>
            ) : (
              <button
                className="join-now-btn"
                onClick={() => handleJoinChat(post.id, post.chatGroupId)}
                disabled={isFull}
              >
                {isFull ? '❌ กลุ่มเต็มแล้ว' : '📨 ขอเข้าร่วมกลุ่ม'}
              </button>
            )}
          </div>
        )}

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