import React, { useState } from 'react';
import { Upload, X, Send, Plus, Heart, MessageCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import './Homepage.css';
import Navbar from '../components/Navbar';

const Hannah = () => (
  <div className="hannah-card">
    <h2>🌟 ยินดีต้อนรับสู่ TGT</h2>
    <p>แพลตฟอร์มแชร์ประสบการณ์การท่องเที่ยวที่ดีที่สุด</p>
  </div>
);

const Homepage = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [joinedGroups, setJoinedGroups] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const [samplePosts] = useState([
    {
      id: 1,
      author: { name: 'นิชา ใจดี', avatar: 'https://s.isanook.com/ns/0/ui/1955/9779218/nychaa_1745205265270.jpeg' },
      groupName: 'Beach Lovers Thailand',
      text: '🏖️ วันนี้ไปเที่ยวหาดป่าตองกับเพื่อนๆ สนุกมากค่ะ! อากาศดีมาก น้ำใสสวย แนะนำให้ไปเที่ยวกันนะคะ',
      images: [
        'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('th-TH'),
      likes: 0,
      comments: ['สวยมากเลย!', 'อยากไปบ้าง'],
      location: '📍 หาดป่าตอง, ภูเก็ต',
      isOwner: false
    }
  ]);

  const currentUser = {
    name: 'คุณ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  };

  // --- ฟังก์ชันจัดการโพสต์ ---
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = { id: Date.now() + Math.random(), file, preview: e.target.result, name: file.name };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = '';
  };

  const removeImage = (imageId) => setImages(prev => prev.filter(img => img.id !== imageId));

  const createPost = () => {
    if (!postText.trim() && images.length === 0) { alert('กรุณาเพิ่มข้อความหรือรูปภาพ'); return; }
    setIsPosting(true);

    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        author: currentUser,
        text: postText,
        images: images.map(img => img.preview),
        timestamp: new Date().toLocaleString('th-TH'),
        likes: 0,
        comments: [],
        groupName: 'Travel Explorers',
        isOwner: true
      };
      setPosts(prev => [newPost, ...prev]);
      setPostText('');
      setImages([]);
      setIsPosting(false);
      setIsModalOpen(false);
    }, 500);
  };

  const deletePost = (postId) => { setPosts(prev => prev.filter(post => post.id !== postId)); setShowDropdown(null); };
  const editPost = (post) => { setEditingPost(post); setPostText(post.text); setIsModalOpen(true); setShowDropdown(null); };
  const updatePost = () => {
    if (!postText.trim()) { alert('กรุณาเพิ่มข้อความ'); return; }
    setPosts(prev => prev.map(post => post.id === editingPost.id ? { ...post, text: postText, timestamp: new Date().toLocaleString('th-TH') + ' (แก้ไข)' } : post));
    setPostText(''); setEditingPost(null); setIsModalOpen(false);
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => { const newLiked = new Set(prev); newLiked.has(postId) ? newLiked.delete(postId) : newLiked.add(postId); return newLiked; });
  };

  const toggleJoinGroup = (groupName) => {
    setJoinedGroups(prev => { const newJoined = new Set(prev); newJoined.has(groupName) ? newJoined.delete(groupName) : newJoined.add(groupName); return newJoined; });
  };

  const toggleComments = (postId) => {
    setShowComments(prev => { const newShow = new Set(prev); newShow.has(postId) ? newShow.delete(postId) : newShow.add(postId); return newShow; });
  };

  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    const allPosts = [...samplePosts, ...posts];
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1 && postIndex < samplePosts.length) {
      samplePosts[postIndex].comments.push(commentText);
    } else {
      setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, comments: [...post.comments, commentText] } : post));
    }
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

      <button className="fab" onClick={() => setIsModalOpen(true)}><Plus size={28} /></button>

      <div className="main-content">
        <Hannah />

        {[...posts, ...samplePosts].map((post) => (
          <div key={post.id} className="post-creator" style={{ position: 'relative' }}>
            <div className="post-header">
              <div className="post-author">
                <img src={post.author.avatar} alt={post.author.name} className="author-avatar"/>
                <div className="author-info">
                  <h3>{post.author.name}</h3>
                  <p>{post.timestamp}</p>
                  {post.groupName && <p className="group-name">📍 {post.groupName}</p>}
                </div>
              </div>

              {post.isOwner && (
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowDropdown(showDropdown === post.id ? null : post.id)} className="dropdown-btn">
                    <MoreVertical size={20} />
                  </button>
                  {showDropdown === post.id && (
                    <div className="dropdown-menu">
                      <button onClick={() => editPost(post)} className="dropdown-item"><Edit size={16}/>แก้ไข</button>
                      <button onClick={() => deletePost(post.id)} className="dropdown-item delete"><Trash2 size={16}/>ลบ</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="post-content"><p>{post.text}</p></div>

            {post.images && post.images.length > 0 && (
              <div className={`image-grid ${post.images.length === 1 ? 'single' : post.images.length === 2 ? 'double' : post.images.length === 3 ? 'triple' : 'multiple'}`}>
                {post.images.slice(0, 4).map((img, index) => (
                  <div key={index} className={`image-item ${post.images.length === 3 && index === 0 ? 'span-two' : ''}`}>
                    <img src={img} alt={`Post image ${index+1}`} className={`post-image ${post.images.length === 1 ? 'full-height' : ''}`}/>
                    {post.images.length > 4 && index === 3 && <div className="more-images">+{post.images.length-4}</div>}
                  </div>
                ))}
              </div>
            )}

            <div className="post-stats">
              <div className="stat-buttons">
                <button className={`stat-btn ${likedPosts.has(post.id)? 'liked':''}`} onClick={() => toggleLike(post.id)}>
                  <Heart size={18} fill={likedPosts.has(post.id)? 'currentColor':'none'}/>
                  <span>{post.likes + (likedPosts.has(post.id)?1:0)}</span>
                </button>
                <button className="stat-btn" onClick={() => toggleComments(post.id)}>
                  <MessageCircle size={18}/>
                  <span>{post.comments.length}</span>
                </button>
              </div>
              <div className="join-group">
                <button className={`join-btn ${joinedGroups.has(post.groupName)? 'joined':''}`} onClick={() => toggleJoinGroup(post.groupName)}>
                  {joinedGroups.has(post.groupName)? '✓ เข้าร่วมแล้ว':'เข้าร่วมกลุ่ม'}
                </button>
              </div>
            </div>

            {showComments.has(post.id) && (
              <div className="comment-section">
                <div className="comments-list">{post.comments.map((comment,i)=><div key={i} className="comment-item">{comment}</div>)}</div>
                <input type="text" placeholder="เขียนคอมเม้น..." className="comment-input" onKeyDown={(e)=>{if(e.key==='Enter'){addComment(post.id,e.target.value);e.target.value='';}}}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
            <h2>{editingPost ? 'แก้ไขโพสต์' : 'สร้างโพสต์ใหม่'}</h2>
            <textarea className="textarea" rows="4" placeholder="คุณคิดอะไรอยู่?" value={postText} onChange={(e)=>setPostText(e.target.value)}/>
            {!editingPost && images.length>0 && (
              <div className="image-grid double" style={{marginTop:'16px'}}>
                {images.map(image=>(
                  <div key={image.id} className="image-item" style={{position:'relative'}}>
                    <img src={image.preview} alt={image.name} className="image-preview"/>
                    <button onClick={()=>removeImage(image.id)} className="remove-image"><X size={16}/></button>
                  </div>
                ))}
              </div>
            )}
            <div className="post-actions">
              {!editingPost && (
                <label className="upload-btn">
                  <Upload size={18}/>เพิ่มรูป
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="file-input"/>
                </label>
              )}
              <div className="button-group">
                <button onClick={()=>{setIsModalOpen(false); setEditingPost(null); setPostText(''); setImages([]);}} className="cancel-btn">ยกเลิก</button>
                <button onClick={editingPost? updatePost : createPost} disabled={isPosting} className="post-btn"><Send size={18}/>{isPosting?'กำลังโพสต์...':editingPost?'บันทึก':'โพสต์'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
