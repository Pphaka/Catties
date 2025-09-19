import { Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    const res = await fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="forgotBox">
      <img
        src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
        alt="Forgot Password"
      />

      <h2>ลืมรหัสผ่าน?</h2>
      <p>กรอกอีเมลของคุณเพื่อรีเซ็ตรหัสผ่านใหม่</p>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="กรอกอีเมลของคุณ" required />
        <button type="submit">ส่งลิงก์รีเซ็ต</button>
      </form>
      <p>
        <Link to="/">⬅ กลับ</Link>
      </p>
    </div>
  );
}
