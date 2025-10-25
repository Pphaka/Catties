import React from 'react';
import { Heart, MessageCircle, MoreVertical, Edit, Trash2, Send } from 'lucide-react';
import './Post.css';

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
  return (
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

      {post.images && post.images.length > 0 && (
        <div className={`post-image-gallery layout-${Math.min(post.images.length, 4)}`}>
          {post.images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`post content ${index + 1}`} />
          ))}
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

      {/* Join Button */}
      <div className="post-join-section">
        <button 
          className="join-now-btn"
          onClick={() => handleJoinChat(post.chatGroupId)}
        >
          เข้าร่วมเลย (Join Now)
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
  );
};

export default PostCard;
