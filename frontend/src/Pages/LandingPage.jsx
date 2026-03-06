import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from "react";
import '../login_page.css'

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const validAccounts = [
      { username: "admin", password: "admin123" },
      { username: "user", password: "user123" },
    ];

    const matched = validAccounts.some(
      (account) =>
        account.username === username && account.password === password
    );

    if (matched) {
      navigate("../dashboard");
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