// Feb.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import './Feb.css';

const Feb = ({ isOpen, onClose, onSubmit, post }) => {
  const [tripTitle, setTripTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  // Effect นี้จะทำงานเมื่อ modal เปิดขึ้นมา
  useEffect(() => {
    if (isOpen) {
      // ถ้าเป็นการ "แก้ไข" และมีข้อมูล post และ post.images อยู่
      if (post && post.images) {
        setTripTitle(post.title || '');
        setPostText(post.content || '');
        // แปลง array ของ image URLs กลับเป็น object ที่ state จัดการได้
        setImages(post.images.map(url => ({ id: url, preview: url })));
      } else {
        // ถ้าเป็นการ "สร้างใหม่" ให้ล้างค่าทั้งหมด
        setTripTitle('');
        setPostText('');
        setImages([]);
      }
    }
  }, [post, isOpen]); // ทำงานใหม่ทุกครั้งที่ post หรือ isOpen เปลี่ยน

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        id: URL.createObjectURL(file), // ใช้ URL เป็น key ชั่วคราว
        preview: URL.createObjectURL(file),
      }));
      // รวมรูปเก่ากับรูปใหม่ และจำกัดจำนวนรูปไม่ให้เกิน 4 รูป
      setImages(prev => [...prev, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async () => {
    if (!tripTitle.trim() && !postText.trim() && images.length === 0) {
      alert('กรุณากรอกข้อมูลอย่างน้อยหนึ่งอย่าง');
      return;
    }
    setIsPosting(true);


    await onSubmit({
      title: tripTitle,
      content: postText,
      images: images.map(img => img.preview) 
    });
    
    setIsPosting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{post ? 'แก้ไขโพสต์' : 'สร้างโพสต์ใหม่'}</h2>

        <input
          type="text"
          className="post-input-topic"
          placeholder="ชื่อทริป"
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
        />
        <textarea
          className="post-textarea"
          placeholder="เขียนอธิบายเพิ่มเติม"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        
        {images.length > 0 && (
          <div className={`post-image-grid layout-${images.length}`}>
            {images.map((img) => (
              <div key={img.id} className="post-image-item">
                <img src={img.preview} alt="Preview" className="post-image-preview" />
                <button className="post-remove-image" onClick={() => removeImage(img.id)}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="post-actions">
          <label className="post-upload-btn">
            <Plus size={18} />
            เพิ่มรูปภาพ
            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
          <div className="button-group">
            <button className="post-cancel-btn" onClick={onClose}>
              ยกเลิก
            </button>
            <button
              className="post-submit-btn"
              onClick={handleSubmit}
              disabled={isPosting || images.length > 4}
            >
              {isPosting ? 'กำลังบันทึก...' : (post ? 'บันทึก' : 'โพสต์')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feb;