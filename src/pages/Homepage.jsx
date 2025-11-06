import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Post from '../components//Post';
import './Homepage.css';

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentUser = {
    name: 'ผู้ใช้งาน',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  };

  // เพิ่มส่วนนี้ - จับ wheel event ทั้งหน้า
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

  return (
    <div className="container">
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brand="TripTogether"
      />

      <main className="main-content">
        <div className="welcome-banner">
          <h2 className="banner-title">
            ⭐ ยินดีต้อนรับสู่ TripTogether
          </h2>
          <p className="banner-subtitle">
            แพลตฟอร์มแชร์ประสบการณ์การท่องเที่ยวที่ดีที่สุด
          </p>
        </div>

        <Post currentUser={currentUser} searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default Homepage;