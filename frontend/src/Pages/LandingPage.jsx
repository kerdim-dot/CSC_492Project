import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import '../login_page.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user_account = [
      { username: "user", password: "user123" }
    ];
    const admin_account = [
        { username: "admin", password: "admin123" },
    ];
    const supervisor_account = [
        { username: "supervisor", password: "supervisor123" },
    ];
          
    const user_matched = user_account.some(
      (user_account) =>
        user_account.username === username && user_account.password === password
    );

    const admin_matched = admin_account.some(
      (admin_account) =>
        admin_account.username === username && admin_account.password === password
    );

    const supervisor_matched = supervisor_account.some(
      (supervisor_account) =>
        supervisor_account.username === username && supervisor_account.password === password
    );

    if (user_matched) {
        localStorage.setItem("role", "user");
        navigate("../dashboard");
    } else if (admin_matched) {
        localStorage.setItem("role", "admin");
        navigate("../dashboard")
    } else if (supervisor_matched) {
        localStorage.setItem("role", "supervisor");
        navigate("../dashboard")
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}