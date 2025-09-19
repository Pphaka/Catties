import React, { useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handleAddPost = () => {
    if (!username.trim()) {
      alert('กรุณากรอกชื่อผู้ใช้');
      return;
    }
    if (!text.trim() && !image) {
      alert('กรุณาเขียนข้อความหรือเลือกรูปภาพ');
      return;
    }

    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const timestamp = now.toLocaleDateString('th-TH', options);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPost = {
        id: Date.now(),
        username,
        timestamp,
        text,
        imageUrl: reader.result,
        comments: []
      };
      setPosts([newPost, ...posts]);
      setUsername('');
      setText('');
      setImage(null);
    };
    if (image) {
      reader.readAsDataURL(image);
    } else {
      reader.onloadend(); // ถ้าไม่มีรูปภาพ
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addComment = (postId, commentText) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, commentText]
        };
      }
      return post;
    }));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Navbar */}
      <div style={{ backgroundColor: '#4267B2', padding: '15px 20px', color: 'white' }}>
        <h1 style={{ margin: 0 }}>MySocialApp</h1>
      </div>

      {/* คอนเทนเนอร์หลัก */}
      <div style={{ maxWidth: '800px', margin: '20px auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
        {/* ส่วนสร้างโพสต์ */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="เขียนข้อความ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '10px' }}
          />
          <button
            onClick={handleAddPost}
            style={{ padding: '10px', backgroundColor: '#4267B2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            โพสต์
          </button>
        </div>

        {/* แสดงโพสต์ */}
        {posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fafafa' }}>
            {/* หัวโพสต์: ชื่อผู้ใช้ วันเวลา */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc', marginRight: '10px' }}></div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{post.username}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>{post.timestamp}</div>
              </div>
            </div>
            {/* เนื้อหาโพสต์ */}
            <p>{post.text}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="โพสต์" style={{ maxWidth: '100%', borderRadius: '4px' }} />}
            {/* คอมเมนต์และปุ่มคอมเมนต์ */}
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => {
                  const commentBox = document.getElementById(`comment-box-${post.id}`);
                  if (commentBox.style.display === 'none' || !commentBox.style.display) {
                    commentBox.style.display = 'block';
                  } else {
                    commentBox.style.display = 'none';
                  }
                }}
                style={{ padding: '8px', backgroundColor: '#4267B2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                คอมเมนต์
              </button>
              {/* คอมเมนต์ */}
              <div id={`comment-box-${post.id}`} style={{ display: 'none', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="เขียนคอมเมนต์..."
                  style={{ width: '70%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addComment(post.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  ref={(input) => (post.commentInput = input)}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(`comment-input-${post.id}`);
                    const value = input.value;
                    addComment(post.id, value);
                    input.value = '';
                  }}
                  style={{ padding: '8px 12px', marginLeft: '8px', backgroundColor: '#4267B2', color: 'white', border: 'none', borderRadius: '4px' }}
                  id={`comment-input-${post.id}`}
                >
                  ส่ง
                </button>
              </div>
            </div>
            {/* แสดงคอมเมนต์ */}
            <div style={{ marginTop: '10px' }}>
              {post.comments.map((comment, index) => (
                <div key={index} style={{ backgroundColor: '#fff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '8px' }}>
                  {comment}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;