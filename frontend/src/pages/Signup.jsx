import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/login.css"; // Same CSS file

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretCode: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup success! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Signup failed. Please check your details.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-white">
        <div className="card-header">
          <h3>Create Account</h3>
          <p>Join as a Mentor</p>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-person"></i>
              <input
                type="text"
                placeholder="Full Name"
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                placeholder="Enter Email"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <i 
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-pw`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          {/* Secret Code */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-shield-lock"></i>
              <input
                type="text"
                placeholder="Secret Code"
                required
                onChange={(e) => setForm({ ...form, secretCode: e.target.value })}
              />
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="btn-login-main">
            Sign Up
          </button>

          <div className="signup-footer">
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}