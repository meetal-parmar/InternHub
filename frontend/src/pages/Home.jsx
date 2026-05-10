import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";
//
export default function Home() {
  return (
    <div className="home-container">

      {/* Navbar */}
      <nav className="nav-bar">
        <div className="logo">
          Intern<span>Hub</span>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="link-login">Login</Link>
          <Link to="/signup" className="btn-signup">Get Started</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">

        <div className="hero-content">
          <h1 className="hero-title">
            Build Your Career with <br />
            <span className="highlight">Expert Mentorship</span>
          </h1>

          <p className="hero-desc">
            The centralized bridge between ambitious interns and industry mentors.
            Track progress and grow faster than ever.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="feature-grid">

          <div className="f-card">
            <span className="f-icon">👨‍🏫</span>
            <h5>Mentor System</h5>
            <p>Smart dashboard for mentors to guide interns.</p>
          </div>

          <div className="f-card">
            <span className="f-icon">👩‍💻</span>
            <h5>Intern Dashboard</h5>
            <p>Track tasks, growth, and performance.</p>
          </div>

          <div className="f-card">
            <span className="f-icon">🔐</span>
            <h5>Secure Portal</h5>
            <p>Safe and role-based authentication system.</p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="footer-simple">
        <p>© 2026 InternHub | Empowering New Talent</p>
      </footer>

    </div>
  );
}