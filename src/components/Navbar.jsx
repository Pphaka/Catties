import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, MapPin, User } from 'lucide-react';
import './Navbar.css';

const navItems = [
  { id: 'home', label: 'Home', icon: <Home size={20} />, path: '/homepage' },
  { id: 'chat', label: 'Chat', icon: <MessageCircle size={20} />, path: '/chat' },
  { id: 'endtrip', label: 'End Trip', icon: <MapPin size={20} />, path: '/endtrip' },
  { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' }
];

const Navbar = ({ searchTerm, setSearchTerm, brand }) => {
  const location = useLocation(); // ดึง path ปัจจุบัน

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="brand">{brand}</h1>
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="nav-items">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-button ${location.pathname === item.path ? 'active' : 'inactive'}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
