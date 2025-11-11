import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePosts } from './PostContext'; 
import { useNotifications } from "./NotificationContext";
import Feb from './Feb';
import PostCard from './PostCard';
import './Post.css';

const Post = ({ currentUser, searchTerm = '', filterByOwner = false, ownerId = null }) => {
  const navigate = useNavigate();
  const { 
    posts, 
    addPost, 
    updatePost: updatePostContext, 
    deletePost: deletePostContext,
    sendJoinRequest,
    approveJoinRequest,
    rejectJoinRequest
  } = usePosts();
  
  const { addNotification } = useNotifications();
  
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
      joinRequests: [],
      members: [],
    };
    addPost(newPost);
  };
  
  const updatePost = (updatedData) => {
    if (editingPost) {
      updatePostContext(editingPost.id, {
        ...updatedData,
        maxMembers: Math.max(3, Math.min(updatedData.maxMembers || editingPost.maxMembers, 10))
      });
    }
  };
  
  const deletePost = (id) => {
    deletePostContext(id);
  };
  
  const toggleLike = (id) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      const isLiking = !likedPosts.has(id);
      
      updatePostContext(id, {
        likes: isLiking ? post.likes + 1 : post.likes - 1
      });

      if (isLiking && post.author.name !== currentUser.name) {
        addNotification({
          type: 'like',
          postId: post.id,
          postTitle: post.title,
          from: currentUser.name,
          fromAvatar: currentUser.avatar,
          to: post.author.name,
          message: `${currentUser.name} ถูกใจโพสต์ "${post.title}" ของคุณ`
        });
      }
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
      const newComment = {
        author: currentUser.name,
        text,
        timestamp: new Date().toLocaleString('th-TH', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      updatePostContext(id, {
        comments: [...post.comments, newComment]
      });

      if (post.author.name !== currentUser.name) {
        addNotification({
          type: 'comment',
          postId: post.id,
          postTitle: post.title,
          from: currentUser.name,
          fromAvatar: currentUser.avatar,
          to: post.author.name,
          message: `${currentUser.name} แสดงความคิดเห็นในโพสต์ "${post.title}": "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`
        });
      }
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

    if (post.author.name === currentUser.name) {
      alert('คุณเป็นผู้สร้างทริปนี้อยู่แล้ว');
      return;
    }

    const alreadyRequested = post.joinRequests?.some(r => r.userName === currentUser.name);
    const alreadyMember = post.members?.some(m => m.userName === currentUser.name);

    if (alreadyRequested) {
      alert('คุณได้ส่งคำขอเข้าร่วมแล้ว กรุณารอการอนุมัติ ⏳');
      return;
    }

    if (alreadyMember) {
      if (chatId) {
        navigate(`/chat/${chatId}`); // ✅ แก้ไข: เพิ่มวงเล็บ ()
      }
      return;
    }

    sendJoinRequest(postId, currentUser);

    addNotification({
      type: 'join_request',
      postId: post.id,
      postTitle: post.title,
      from: currentUser.name,
      fromAvatar: currentUser.avatar,
      to: post.author.name,
      message: `${currentUser.name} ขอเข้าร่วมทริป "${post.title}"`
    });

    alert('ส่งคำขอเข้าร่วมกลุ่มเรียบร้อย! 🎉');
  };

  const filteredPosts = posts.filter(post => {
    if (filterByOwner && post.author.name !== ownerId) {
      return false;
    }

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
              approveJoinRequest={approveJoinRequest}
              rejectJoinRequest={rejectJoinRequest}
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