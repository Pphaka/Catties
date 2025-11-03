import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, MapPin, User, Search } from 'lucide-react';
import './Navbar.css';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/homepage', tooltip: 'หน้าหลัก' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat', tooltip: 'แชท' },
  { id: 'endtrip', label: 'End Trip', icon: MapPin, path: '/endtrip', tooltip: 'สิ้นสุดการเดินทาง' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile', tooltip: 'โปรไฟล์' }
];

const Navbar = ({ searchTerm, setSearchTerm, brand = "MyBrand" }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create sparkle effect
  const createSparkle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparkles = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      delay: i * 0.2
    }));

    setSparkles(prev => [...prev, ...newSparkles]);

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 1000);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand/Logo */}
        <h1 
          className="brand"
          onMouseEnter={createSparkle}
        >
          {brand}
          {sparkles.map(sparkle => (
            <span
              key={sparkle.id}
              className="sparkle"
              style={{
                left: `${sparkle.x}px`,
                top: `${sparkle.y}px`,
                animationDelay: `${sparkle.delay}s`
              }}
            >
              ✨
            </span>
          ))}
        </h1>

        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-button ${isActive ? 'active' : 'inactive'}`}

              >
                {/* Icon */}
                <span className="nav-icon">
                  <Icon size={20} />
                </span>

                {/* Label */}
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;