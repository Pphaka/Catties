import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import GroupList from '../../components/Chat/GroupList';
import ChatWindow from '../../components/Chat/ChatWindow';
import CreateGroupModal from '../../components/Chat/CreateGroupModal';
import LocationModal from '../../components/Chat/LocationModal';
import './Chat.css';


const Chat = () => {
  const { groupId } = useParams();
  
  // Search & UI states
  const [groupSearch, setGroupSearch] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [currentUser] = useState('คุณ');
  const [isTripEnded, setIsTripEnded] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  
  // Create Group Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupAvatar, setNewGroupAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Message states
  const [messageInput, setMessageInput] = useState('');
  
  // Location Modal states
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');

  // Groups data
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Nomad Collective',
      avatar: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Doughnut : พรุ่งนี้เราเจอกัน 7:00 น. นะคะ',
      date: '1 May 2025',
      unread: 3,
      messages: [
        { id: 1, sender: 'Doughnut', text: 'สวัสดีค่ะทุกคน!', time: '10:30', isOwn: false },
        { id: 2, sender: 'Alex', text: 'สวัสดีครับ', time: '10:32', isOwn: false },
        { id: 3, sender: 'Doughnut', text: 'พรุ่งนี้เราเจอกัน 7:00 น. นะคะ', time: '10:35', isOwn: false }
      ],
    },
    {
      id: '2',
      name: 'Latitude Lovers',
      avatar: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'คุม : โอเคคับบ',
      date: '30 April 2025',
      unread: 0,
      messages: [
        { id: 1, sender: 'Sarah', text: 'เราไปเที่ยวกันไหม?', time: '09:15', isOwn: false },
        { id: 2, sender: 'คุม', text: 'โอเคคับบ', time: '09:20', isOwn: false }
      ],
    }
  ]);

  // Load Google Maps Script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Open chat from URL
  useEffect(() => {
    if (!groupId) return;
    const groupToOpen = groups.find(g => g.id === groupId);
    if (groupToOpen && (!activeChat || activeChat.id !== groupToOpen.id)) {
      handleChatClick(groupToOpen.id);
    }
  }, [groupId, groups, activeChat]);

  // Avatar upload handler
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewGroupAvatar(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Create group handler
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup = {
      id: String(Date.now()),
      name: newGroupName,
      avatar: avatarPreview || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'ยังไม่มีข้อความ',
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
      unread: 0,
      messages: []
    };
    setGroups(prev => [newGroup, ...prev]);
    setIsModalOpen(false);
    setNewGroupName('');
    setNewGroupAvatar(null);
    setAvatarPreview(null);
  };

  // Chat click handler
  const handleChatClick = (clickedGroupId) => {
    const group = groups.find(g => g.id === clickedGroupId);
    setActiveChat(group);
    setIsTripEnded(false);
    setGroups(prev =>
      prev.map(g => g.id === clickedGroupId ? { ...g, unread: 0 } : g)
    );
  };

  // Send message handler
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat || isTripEnded) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      text: messageInput,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setGroups(prev =>
      prev.map(group =>
        group.id === activeChat.id
          ? { 
              ...group, 
              messages: [...group.messages, newMessage], 
              description: currentUser + ' : ' + messageInput,
              date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) 
            }
          : group
      )
    );
    setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    setMessageInput('');
  };

  // Send location handler
  const handleSendLocation = () => {
    if (!selectedLocation || !activeChat || isTripEnded) return;

    const locationText = selectedLocation.name
      ? '📍 ' + selectedLocation.name + '\n' + (selectedLocation.address || '')
      : '📍 พิกัด: ' + selectedLocation.lat.toFixed(6) + ', ' + selectedLocation.lng.toFixed(6);

    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      text: locationText,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      type: 'location',
      location: selectedLocation
    };

    setGroups(prev =>
      prev.map(group =>
        group.id === activeChat.id
          ? { 
              ...group, 
              messages: [...group.messages, newMessage], 
              description: currentUser + ' : ส่งตำแหน่งที่อยู่',
              date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) 
            }
          : group
      )
    );
    setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    setIsLocationModalOpen(false);
    setSelectedLocation(null);
    setSearchLocation('');
  };

  // End trip handler
  const handleEndTrip = () => {
    if (!activeChat) return;
    setIsTripEnded(true);
    setGroups(prev =>
      prev.map(group =>
        group.id === activeChat.id
          ? { ...group, description: 'ทริปนี้จบแล้ว ✅' }
          : group
      )
    );
    setIsOptionsOpen(false);
    window.location.href = `/end-trip/${activeChat.id}`;
  };

  // Filter groups by search
  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  return (
    <div className="chat">
      {!activeChat && <Navbar brand="TripTogether" />}

      {!activeChat ? (
        <GroupList
          groups={filteredGroups}
          searchTerm={groupSearch}
          onSearchChange={setGroupSearch}
          onChatClick={handleChatClick}
          onCreateGroup={() => setIsModalOpen(true)}
        />
      ) : (
        <ChatWindow
          chat={activeChat}
          messageInput={messageInput}
          isTripEnded={isTripEnded}
          isOptionsOpen={isOptionsOpen}
          onBack={() => setActiveChat(null)}
          onToggleOptions={() => setIsOptionsOpen(prev => !prev)}
          onEndTrip={handleEndTrip}
          onInputChange={setMessageInput}
          onSendMessage={handleSendMessage}
          onOpenLocationModal={() => !isTripEnded && setIsLocationModalOpen(true)}
        />
      )}

      <CreateGroupModal
        isOpen={isModalOpen}
        groupName={newGroupName}
        avatarPreview={avatarPreview}
        onClose={() => setIsModalOpen(false)}
        onNameChange={setNewGroupName}
        onAvatarUpload={handleAvatarUpload}
        onCreateGroup={handleCreateGroup}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        selectedLocation={selectedLocation}
        searchLocation={searchLocation}
        onClose={() => {
          setIsLocationModalOpen(false);
          setSelectedLocation(null);
          setSearchLocation('');
        }}
        onSearchChange={setSearchLocation}
        onSendLocation={handleSendLocation}
        onLocationChange={setSelectedLocation}
      />
    </div>
  );
};

export default Chat;