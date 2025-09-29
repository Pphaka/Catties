import { Link } from "react-router-dom";
import styles from"./Register.module.css";

export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const fullname = e.target.fullname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      alert("Your password does not match!");
      return;
    }

    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, password }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message));
  };

  return (
    <div className={styles.registerBox}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullname" placeholder="ชื่อ-นามสกุล" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirm" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
        <p>
          มีบัญชีแล้ว? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
