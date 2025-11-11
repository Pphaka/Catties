// src/components/Notification/NotificationPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from "../components/NotificationContext";
import Navbar from "../components/Navbar";
import { Heart, MessageCircle, Users, CheckCircle, XCircle, X } from 'lucide-react';
import './NotificationPage.css';

const NotificationPage = ({ currentUser }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  // กรองเฉพาะ notification ของ user นี้
  const myNotifications = notifications.filter(notif => notif.to === currentUser?.name);

  // ไอคอนตามประเภท
  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="notif-icon like" />;
      case 'comment':
        return <MessageCircle size={20} className="notif-icon comment" />;
      case 'join_request':
        return <Users size={20} className="notif-icon request" />;
      case 'request_approved':
        return <CheckCircle size={20} className="notif-icon approved" />;
      case 'request_rejected':
        return <XCircle size={20} className="notif-icon rejected" />;
      default:
        return null;
    }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
  };

  return (
    <div className="notifications-page">
      <Navbar brand="TripTogether" currentUser={currentUser} />
      
      <div className="notifications-container">
        <div className="notifications-header">
          <h2 className="notifications-title">การแจ้งเตือน</h2>
          {myNotifications.length > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              ทำเครื่องหมายว่าอ่านทั้งหมด
            </button>
          )}
        </div>

        {myNotifications.length === 0 ? (
          <div className="empty-notifications">
            <p>ไม่มีการแจ้งเตือนในขณะนี้</p>
          </div>
        ) : (
          <div className="notifications-list">
            {myNotifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="notif-icon-wrapper">
                  {getIcon(notif.type)}
                </div>
                
                <img 
                  src={notif.fromAvatar} 
                  alt={notif.from}
                  className="notif-avatar"
                />
                
                <div className="notif-content">
                  <p className="notif-message">{notif.message}</p>
                  <p className="notif-time">{notif.timestamp}</p>
                </div>

                <button 
                  className="delete-notif-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                >
                  <X size={16} />
                </button>

                {!notif.read && <div className="unread-dot"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
