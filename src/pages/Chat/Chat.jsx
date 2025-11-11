import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import GroupList from './components/GroupList';
import ChatWindow from './components/ChatWindow';
import CreateGroupModal from './components/CreateGroupModal';
import LocationModal from './components/LocationModal';
import './Chat.css';

const Chat = () => {
  const { groupId } = useParams();
  
  const [groupSearch, setGroupSearch] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [currentUser] = useState('คุณ');
  const [isTripEnded, setIsTripEnded] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMaxMembers, setNewGroupMaxMembers] = useState(10);
  const [newGroupAvatar, setNewGroupAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [messageInput, setMessageInput] = useState('');
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');

  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Nomad Collective',
      avatar: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Doughnut : พรุ่งนี้เราเจอกัน 7:00 น. นะคะ',
      date: '1 May 2025',
      unread: 3,
      maxMembers: 10,
      currentMembers: 10,
      members: ['Doughnut', 'Alex', 'Sarah', 'John', 'Mike', 'Lisa', 'Tom', 'คุณ','Tan','Tristan'],
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
      maxMembers: 5,
      currentMembers: 5,
      members: ['Sarah', 'คุม', 'Anna', 'David', 'Emma'],
      messages: [
        { id: 1, sender: 'Sarah', text: 'เราไปเที่ยวกันไหม?', time: '09:15', isOwn: false },
        { id: 2, sender: 'คุม', text: 'โอเคคับบ', time: '09:20', isOwn: false }
      ],
    },
    {
      id: '3',
      name: 'Adventure Seekers',
      avatar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'คุณ : เจอกันวันเสาร์นะครับ',
      date: '2 May 2025',
      unread: 1,
      maxMembers: 8,
      currentMembers: 4,
      members: ['คุณ', 'Jane', 'Mark', 'Peter'],
      messages: [
        { id: 1, sender: 'Jane', text: 'ใครพร้อมแล้วบ้าง?', time: '14:20', isOwn: false },
        { id: 2, sender: 'คุณ', text: 'เจอกันวันเสาร์นะครับ', time: '14:25', isOwn: true }
      ],
    }
  ]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!groupId) return;
    const groupToOpen = groups.find(g => g.id === groupId);
    if (groupToOpen && (!activeChat || activeChat.id !== groupToOpen.id)) {
      handleChatClick(groupToOpen.id);
    }
  }, [groupId, groups, activeChat]);

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

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup = {
      id: String(Date.now()),
      name: newGroupName,
      avatar: avatarPreview || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'ยังไม่มีข้อความ',
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
      unread: 0,
      maxMembers: Math.max(3, Math.min(parseInt(newGroupMaxMembers) || 3, 10)), 
      currentMembers: 1,
      members: [currentUser],
      messages: []
    };
    
    // ย้ายโค้ดข้างล่างนี้เข้ามาใน function
    setGroups(prev => [newGroup, ...prev]);
    setIsModalOpen(false);
    setNewGroupName('');
    setNewGroupMaxMembers(10);
    setNewGroupAvatar(null);
    setAvatarPreview(null);
  };

  // แก้ไข handleChatClick ให้กระชับขึ้น
  const handleChatClick = (clickedGroupId) => {
    // ดึงข้อมูลกลุ่มล่าสุดจาก state
    const currentGroups = groups;
    const group = currentGroups.find(g => g.id === clickedGroupId);
    
    if (!group) return;
  
    const isAlreadyMember = group.members.includes(currentUser);
    const isFull = group.currentMembers >= group.maxMembers;
  
    // ถ้าเป็นสมาชิกอยู่แล้ว → เปิดแชทได้เลย (ไม่สนใจว่าเต็มหรือไม่)
    if (isAlreadyMember) {
      setActiveChat(group);
      setIsTripEnded(false);
      setGroups(prev =>
        prev.map(g =>
          g.id === clickedGroupId ? { ...g, unread: 0 } : g
        )
      );
      return; // จบตรงนี้เลย
    }
  
    //  ถึงตรงนี้แปลว่า: ยังไม่ได้เป็นสมาชิก
    
    // ถ้ากลุ่มเต็ม → ห้ามเข้า
    if (isFull) {
      alert('กลุ่มนี้เต็มแล้ว ไม่สามารถเข้าร่วมได้');
      return;
    }
  
    // ถ้ากลุ่มยังไม่เต็ม → เพิ่มเข้ากลุ่ม
    setGroups(prev =>
      prev.map(g =>
        g.id === clickedGroupId
          ? {
              ...g,
              members: [...g.members, currentUser],
              currentMembers: g.currentMembers + 1,
              unread: 0
            }
          : g
      )
    );
  
    // สร้าง group object ใหม่ที่มี currentUser แล้ว
    const updatedGroup = {
      ...group,
      members: [...group.members, currentUser],
      currentMembers: group.currentMembers + 1,
      unread: 0
    };
  
    setActiveChat(updatedGroup);
    setIsTripEnded(false);
  };

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

  const handleEndTrip = () => {
    if (!activeChat) return;
    setIsTripEnded(true);
    setGroups(prev =>
      prev.map(group =>
        group.id === activeChat.id
          ? { ...group, description: 'ทริปนี้จบแล้ว' }
          : group
      )
    );
    setIsOptionsOpen(false);
    window.location.href = `/end-trip/${activeChat.id}`;
  };

  // กรองเฉพาะกลุ่มที่เราเป็นสมาชิก
  const myGroups = groups.filter(g => g.members.includes(currentUser));
  const filteredGroups = myGroups.filter(g => 
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
          currentUser={currentUser}
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
        maxMembers={newGroupMaxMembers}
        avatarPreview={avatarPreview}
        onClose={() => setIsModalOpen(false)}
        onNameChange={setNewGroupName}
        onMaxMembersChange={setNewGroupMaxMembers}
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