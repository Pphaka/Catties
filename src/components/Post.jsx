import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, MessageCircle, MoreVertical, Edit, Trash2, Send } from 'lucide-react';
import Feb from './Feb';
import './Post.css';

// ✨ ข้อมูลโพสต์ตัวอย่าง
const initialPosts = [
  {
    id: 101,
    author: {
      name: 'Doughnut',
      avatar: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    timestamp: '16 ตุลาคม 2025',
    title: 'ทริปเชียงใหม่กับ Nomad Collective',
    content: 'สวัสดีค่ะทุกคน! พรุ่งนี้เราเจอกันที่เชียงใหม่ 7:00 น. นะคะ ใครสนใจทริปนี้ กดเข้าร่วมกลุ่มเพื่อดูรายละเอียดเพิ่มเติมได้เลย!',
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ],
    likes: 42,
    comments: [],
    isOwner: false,
    chatGroupId: '1', // <-- ลิงก์ไปยังแชทกลุ่ม 'Nomad Collective'
  },
  
];


const Post = ({ currentUser }) => {
  // Hook สำหรับการเปลี่ยนหน้า (Routing)
  const navigate = useNavigate();

  // ✨ แก้ไข: ใช้ initialPosts เป็นค่าเริ่มต้นของ state
  const [posts, setPosts] = useState(initialPosts);
  
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const createPost = (postData) => {
    const newPost = {
      ...postData,
      id: Date.now(),
      author: currentUser,
      timestamp: new Date().toLocaleString('th-TH'),
      likes: 0,
      comments: [],
      isOwner: true,
      // สมมติว่าโพสต์ใหม่จะเชื่อมไปยังกลุ่มแชท ID '1' เพื่อการทดสอบ
      chatGroupId: '1'
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (updatedData) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === editingPost.id
          ? { ...p, ...updatedData }
          : p
      )
    );
  };

  const deletePost = (id) => setPosts(prev => prev.filter(p => p.id !== id));
  
  const toggleLike = (id) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, likes: likedPosts.has(id) ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleComments = (id) => {
    setShowComments(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const addComment = (id) => {
    const text = commentInputs[id];
    if (!text?.trim()) return;
    
    setPosts(prev => prev.map(p =>
      p.id === id ? { 
        ...p, 
        comments: [...p.comments, { 
          author: currentUser.name, 
          text,
          timestamp: new Date().toLocaleString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }] 
      } : p
    ));
    
    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  const handleCommentInput = (id, value) => {
    setCommentInputs(prev => ({ ...prev, [id]: value }));
  };

  // ฟังก์ชันสำหรับจัดการการคลิกปุ่ม "Join Now"
  const handleJoinChat = (chatId) => {
    if (chatId) {
      // ไปยังหน้าแชทตาม path ที่เรากำหนดใน Router (เช่น /chat/1)
      navigate(`/chat/${chatId}`);
    } else {
      console.error("ไม่พบ ID สำหรับแชทกลุ่มนี้!");
    }
  };
  
  return (
    <div className="post-container">
      <button className="post-fab" onClick={handleOpenCreateModal}>
        <Plus size={28} />
      </button>

      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                <div className="author-info">
                  <h3>{post.author.name}</h3>
                  <p>{post.timestamp}</p>
                </div>
              </div>
              {post.isOwner && (
                <div className="dropdown" ref={dropdownRef}>
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

            {post.title && <h2 className="post-title">{post.title}</h2>}
            {post.content && <p className="post-content">{post.content}</p>}

            {post.images && post.images.length > 0 && (
              <div className={`post-image-gallery layout-${Math.min(post.images.length, 4)}`}>
                {post.images.map((imageUrl, index) => (
                  <img key={index} src={imageUrl} alt={`post content ${index + 1}`} />
                ))}
              </div>
            )}

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

            {/* เพิ่มปุ่ม Join Now และฟังก์ชัน onClick */}
            <div className="post-join-section">
              <button 
                className="join-now-btn"
                onClick={() => handleJoinChat(post.chatGroupId)}
              >
                เข้าร่วมเลย (Join Now)
              </button>
            </div>

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
        ))}
      </div>
      
      <Feb
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingPost ? updatePost : createPost}
        post={editingPost}
      />
    </div>
  );
};

export default Post;

