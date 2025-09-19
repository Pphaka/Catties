import { Link } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    fetch("http://localhost:5500/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message));
  };

  return (
    <div className={styles.loginBox}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />

        <div className={styles.authFooter}>
          <Link to="/forgot">Forgot password?</Link>
        </div>

        <button type="submit">Login</button>
        <p>
          Don’t have any account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
