import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/login.css"; // Wahi CSS file use kar rahe hain
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
          toast.success("OTP sent successfully!", {
          duration: 2000, 
        });
        localStorage.setItem("resetEmail", email);
        navigate("/verify");
      } else {
        toast.error(data.msg || "Something went wrong.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-white">
        <div className="card-header">
          <h3>Reset Password</h3>
          <p>Enter your registered email address </p>
        </div>

        <div className="form-body">
          {/* Email Input */}
          <div className="input-group-custom">
            <div className="input-with-icon">
              <i className="bi bi-envelope"></i>
              <input 
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button 
            className="btn-login-main" 
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <div className="signup-footer">
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <i className="bi bi-arrow-left"></i> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}