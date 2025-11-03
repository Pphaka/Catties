import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import Feb from '../components/Feb';
import './Homepage.css';

const Homepage = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const [isFebOpen, setIsFebOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const currentUser = {
    name: 'คุณ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...'
  };

  const [posts, setPosts] = useState([
    {
      id: 2,
      author: {
        name: 'คุณ',
        avatar: currentUser.avatar,
      },
      title: 'ไปเที่ยวเกาะเสม็ด 🌊',
      content: 'น้ำใสมาก แดดแรงแต่สวยสุดๆ 🏝️',
      timestamp: 'เมื่อวานนี้',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'
      ],
      likes: 5,
      comments: [],
      chatGroupId: 'trip456',
      isOwner: true,
    }
  ]);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const updated = new Set(prev);
      if (updated.has(postId)) updated.delete(postId);
      else updated.add(postId);
      return updated;
    });

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, likes: likedPosts.has(postId) ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => {
      const updated = new Set(prev);
      if (updated.has(postId)) updated.delete(postId);
      else updated.add(postId);
      return updated;
    });
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const addComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { author: currentUser.name, text, timestamp: 'เมื่อสักครู่' },
              ],
            }
          : p
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleJoinChat = (chatGroupId) => {
    alert(`เข้าร่วมกลุ่มแชท: ${chatGroupId}`);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setIsFebOpen(true);
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleSubmitPost = (newPost) => {
    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? { ...p, ...newPost } : p))
      );
      setEditingPost(null);
    } else {
      const newId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
      const newPostObj = {
        id: newId,
        author: currentUser,
        timestamp: 'เมื่อสักครู่',
        likes: 0,
        comments: [],
        chatGroupId: `trip${newId}`,
        isOwner: true,
        ...newPost,
      };
      setPosts((prev) => [newPostObj, ...prev]);
    }
  };

  return (
    <div className="app-con">
      <Navbar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brand="TripTogether"
      />

      <div className="content-wrapper">
        <div className="hannah-card">
          <h2>🌟 ยินดีต้อนรับสู่ TGT</h2>
          <p>แพลตฟอร์มแชร์ประสบการณ์การท่องเที่ยวที่ดีที่สุด</p>
        </div>

        {/* แสดงทุกโพสต์ */}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            likedPosts={likedPosts}
            showComments={showComments}
            commentInputs={commentInputs}
            toggleLike={toggleLike}
            toggleComments={toggleComments}
            handleCommentInput={handleCommentInput}
            addComment={addComment}
            handleJoinChat={handleJoinChat}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            handleOpenEditModal={handleOpenEditModal}
            deletePost={deletePost}
          />
        ))}

        {/* 🔹 Feb Modal */}
        <Feb
          isOpen={isFebOpen}
          onClose={() => setIsFebOpen(false)}
          onSubmit={handleSubmitPost}
          post={editingPost}
        />

        {/* 🔹 Floating Button */}
        <button
          className="fab"
          onClick={() => {
            setEditingPost(null);
            setIsFebOpen(true);
          }}
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
};

export default Homepage;