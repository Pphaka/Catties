import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    {
      id: 101,
      author: {
        name: 'Doughnut',
        avatar: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?w=200',
      },
      timestamp: '16 ตุลาคม 2025',
      title: 'ทริปเชียงใหม่กับ Nomad Collective',
      content: 'สวัสดีค่ะทุกคน! พรุ่งนี้เราเจอกันที่เชียงใหม่ 7:00 น.',
      images: ['https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800'],
      likes: 42,
      comments: [],
      isOwner: false,
      chatGroupId: '1',
      maxMembers: 10,
      currentMembers: 7,
    },
    // ✅ เพิ่มโพสต์ของ Karen
    {
      id: 102,
      author: {
        name: 'Karen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      },
      timestamp: '9 พฤษภาคม 2025',
      title: 'Chiang Mai',
      content: '🌸 Chiang Mai Escape – ทริปโรแมนติกเมืองเหนือ 🌺\n🗓 10–13 ธันวาคม 2025',
      images: ['https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&h=400&fit=crop'],
      likes: 12,
      comments: [],
      isOwner: true,
      chatGroupId: '2',
      maxMembers: 10,
      currentMembers: 10,
    },
  ]);

  const addPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id, updatedData) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within PostProvider');
  }
  return context;
};