import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css"; // Hum same CSS file use kar sakte hain
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_URL;


export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const reset = async () => {
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Session expired. Start again.");
      navigate("/forgot");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password has been reset successfully!", {
          duration: 3000, // Yeh 5 second tak dikhega
        });
        localStorage.removeItem("resetEmail");
        setTimeout(() => {
          navigate("/Login"); 
        }, 2000);
      } else {
        toast.error(data.msg || "Reset failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-white">
        <div className="card-header">
          <h3>Reset Password</h3>
          <p>Please enter your new password below.</p>
        </div>

        <div className="form-body">
          {/* New Password */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input 
                type="password"
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-shield-check"></i>
              <input 
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="btn-login-main" onClick={reset} style={{ marginTop: "10px" }}>
            Reset Password
          </button>

          <div className="signup-footer">
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#667eea" }}>
              Back to Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}