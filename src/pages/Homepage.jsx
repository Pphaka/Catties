import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Post from '../components/Post';
import './Homepage.css';

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentUser = {
    name: 'Karen', // ✅ เปลี่ยนจาก 'ผู้ใช้งาน' เป็นชื่อจริง
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  };

  useEffect(() => {
    const handleWheel = (e) => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const suggestions = ['ทะเล', 'ภูเขา', 'น้ำตก', 'วัดวาอาราม', 'คาเฟ่', 'ถ่ายรูป', 'เดินป่า', 'ปลูกป่า'];

  return (
    <div className="container">
      <Navbar brand="TripTogether" />
      
      <div className="homepage-layout">
        {/* Main Content - ซ้าย */}
        <main className="main-content">
          <div className="welcome-banner">
            <h2 className="banner-title">
              🚗 ยินดีต้อนรับสู่ TripTogether 💨
            </h2>
            <p className="banner-subtitle">
              แพลตฟอร์มแชร์ประสบการณ์การท่องเที่ยวที่ดีที่สุด
            </p>
          </div>

          {/* ✅ แสดงโพสต์ทุกคน */}
          <Post 
            currentUser={currentUser} 
            searchTerm={searchTerm}
            filterByOwner={false}  // ✅ แสดงโพสต์ทุกคน
          />
        </main>

        {/* Search Sidebar - ขวา */}
        <aside className="search-sidebar">
          <div className="search-box-sticky">
            <div className="search-box">
              <div className="search-header">
                <Sparkles size={18} className="sparkle-icon" />
                <h3>ค้นหาทริปของคุณ</h3>
              </div>

              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหาทริป, สถานที่..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="search-clear-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="suggestions-section">
              <div className="suggestions-header">
                <Sparkles size={18} />
                <h3>💡 คำแนะนำ</h3>
              </div>
              <div className="suggestion-tags">
                {suggestions.map((tag, index) => (
                  <button 
                    key={index} 
                    className="suggestion-tag"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Homepage;