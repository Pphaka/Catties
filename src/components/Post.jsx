import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Feb from './Feb';
import PostCard from './PostCard';
import './Post.css';

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
    chatGroupId: '1',
    maxMembers: 10,
    currentMembers: 7,
  },
  {
    id: 102,
    author: {
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    timestamp: '15 ตุลาคม 2025',
    title: 'Latitude Lovers - ทริปเต็มแล้ว!',
    content: 'ขอบคุณทุกคนที่สนใจนะคะ กลุ่มเต็มแล้วค่ะ แต่สามารถติดตามการเดินทางของเราได้เลย!',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ],
    likes: 28,
    comments: [],
    isOwner: false,
    chatGroupId: '2',
    maxMembers: 10,
    currentMembers: 10,
  },
];

const Post = ({ currentUser, searchTerm = '' }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

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
      chatGroupId: String(Date.now()),
      maxMembers: Math.max(3, Math.min(postData.maxMembers || 3, 10)),  // ← 3-10
      currentMembers: 1,
    };
    setPosts(prev => [newPost, ...prev]);
  };
  
  const updatePost = (updatedData) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === editingPost.id
          ? { 
              ...p, 
              ...updatedData,
              maxMembers: Math.max(3, Math.min(updatedData.maxMembers || p.maxMembers, 10))
            }
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

  const handleJoinChat = (postId, chatId) => {
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // ตรวจสอบว่าเต็มหรือไม่
    if (post.currentMembers >= post.maxMembers) {
      alert('ขอโทษด้วยกลุ่มนี้เต็มแล้ว (10/10 คน)');
      return;
    }
    
    // เพิ่มจำนวนสมาชิก
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, currentMembers: p.currentMembers + 1 }
        : p
    ));
    
    // นำทางไปหน้าแชท
    if (chatId) {
      navigate(`/chat/${chatId}`);
    } else {
      console.error("ไม่พบ ID สำหรับแชทกลุ่มนี้!");
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title?.toLowerCase().includes(searchLower) ||
      post.content?.toLowerCase().includes(searchLower) ||
      post.author?.name?.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="post-container">
      <button className="post-fab" onClick={handleOpenCreateModal}>
        <Plus size={28} />
      </button>

      <div className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
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
          ))
        ) : (
          <div className="empty-state">
            {searchTerm 
              ? `ไม่พบโพสต์ที่ตรงกับการค้นหา "${searchTerm}"`
              : 'ยังไม่มีโพสต์ กดปุ่ม + เพื่อสร้างโพสต์แรก'
            }
          </div>
        )}
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