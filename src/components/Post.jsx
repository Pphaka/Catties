import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePosts } from './PostContext'; 
import Feb from './Feb';
import PostCard from './PostCard';
import './Post.css';

const Post = ({ currentUser, searchTerm = '', filterByOwner = false, ownerId = null }) => { // ✅ เพิ่ม props
  const navigate = useNavigate();
  const { posts, addPost, updatePost: updatePostContext, deletePost: deletePostContext } = usePosts(); // ✅ ใช้ Context
  
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
      maxMembers: Math.max(3, Math.min(postData.maxMembers || 3, 10)),
      currentMembers: 1,
    };
    addPost(newPost); // ✅ ใช้ function จาก Context
  };
  
  const updatePost = (updatedData) => {
    if (editingPost) {
      updatePostContext(editingPost.id, {
        ...updatedData,
        maxMembers: Math.max(3, Math.min(updatedData.maxMembers || editingPost.maxMembers, 10))
      }); // ✅ ใช้ function จาก Context
    }
  };
  
  const deletePost = (id) => {
    deletePostContext(id); // ✅ ใช้ function จาก Context
  };
  
  const toggleLike = (id) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      updatePostContext(id, {
        likes: likedPosts.has(id) ? post.likes - 1 : post.likes + 1
      });
    }
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
    
    const post = posts.find(p => p.id === id);
    if (post) {
      updatePostContext(id, {
        comments: [...post.comments, {
          author: currentUser.name,
          text,
          timestamp: new Date().toLocaleString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }]
      });
    }
    
    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  const handleCommentInput = (id, value) => {
    setCommentInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleJoinChat = (postId, chatId) => {
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    if (post.currentMembers >= post.maxMembers) {
      alert('ขอโทษด้วยกลุ่มนี้เต็มแล้ว');
      return;
    }
    
    updatePostContext(postId, {
      currentMembers: post.currentMembers + 1
    });
    
    if (chatId) {
      navigate(`/chat/${chatId}`);
    } else {
      console.error("ไม่พบ ID สำหรับแชทกลุ่มนี้!");
    }
  };

  // ✅ Filter posts based on search term and owner
  const filteredPosts = posts.filter(post => {
    // ถ้าอยู่ที่หน้า Profile → แสดงเฉพาะโพสต์ของเจ้าของ
    if (filterByOwner && post.author.name !== ownerId) {
      return false;
    }

    // ถ้ามีการค้นหา → filter ตาม searchTerm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.author?.name?.toLowerCase().includes(searchLower)
      );
    }

    return true;
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
            {filterByOwner 
              ? 'คุณยังไม่มีโพสต์ กดปุ่ม + เพื่อสร้างโพสต์แรก'
              : (searchTerm 
                  ? `ไม่พบโพสต์ที่ตรงกับการค้นหา "${searchTerm}"`
                  : 'ยังไม่มีโพสต์ กดปุ่ม + เพื่อสร้างโพสต์แรก'
                )
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