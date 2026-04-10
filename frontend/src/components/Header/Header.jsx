import { useState } from "react";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom"; // Link aur useNavigate add kiya
import "./Header.css";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("token"); // Token delete karo
    // Agar aapke paas koi state management (Redux/Context) hai toh wahan se bhi user clear karein
    navigate("/login"); // Login page par bhej do
  };

  return (
    <header className="minimal-header">
      {/* 1. Logo */}
      <div className="header-logo">
        <span className="logo-text">Intern<span className="blue-text">Hub</span></span>
      </div>

      {/* 2. Right Side: Profile & Dropdown */}
      <div className="header-right">
        <div className="profile-wrapper" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="avatar-circle">
            <FiUser size={18} />
          </div>
          <FiChevronDown size={14} className={showDropdown ? "rotate" : ""} />

          {showDropdown && (
            <div className="simple-dropdown">
              {/* Profile Link */}
              <Link to="/profile" className="dropdown-link" style={{ textDecoration: 'none' }}>
                <FiUser size={16} /> <span>Profile</span>
              </Link>

              {/* Logout Button */}
              <div className="dropdown-link logout" onClick={handleLogout}>
                <FiLogOut size={16} /> <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;