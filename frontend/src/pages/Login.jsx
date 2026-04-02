import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/login.css";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token); 
      localStorage.setItem("role", data.user.role);

        dispatch({ type: "LOGIN", payload: data.user });

        if (data.user.role === "MENTOR") {
            navigate("/mentor-dashboard");
        } else if (data.user.role === "INTERN") {
            navigate("/intern-dashboard");
        }
      } else {
        setError(data.errors?.email || data.errors?.password || data.message || "Incorrect email or password");
      }
    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-white">
        <div className="card-header">
          <h3>Login</h3>
        </div>

        <div className="form-body">
          {/* Email */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                placeholder="Enter Email"
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
                placeholder="Enter Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <i 
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-pw`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="options">
            <Link to="/forgot" className="f-link">Forgot password?</Link>
          </div>

          <button className="btn-login-main" onClick={handleLogin}>
            Login
          </button>

          <div className="signup-footer">
            <span>Don't have an account? </span>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}