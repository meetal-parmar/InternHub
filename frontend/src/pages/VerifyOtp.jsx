import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/login.css";


export default function VerifyOtp() {
  const [otp, setOtp] = useState(new Array(6).fill("")); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (element, index) => {
    if (isNaN(element.value)) return false; 
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Auto-focus next input
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const verify = async () => {
    const email = localStorage.getItem("resetEmail");
    const fullOtp = otp.join(""); 

    if (!email) {
      setError("Email missing. Start again.");
      return;
    }

    if (fullOtp.length < 6) {
      setError("Please enter 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp })
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/reset");
      } else {
        setError(data.msg || "Invalid OTP");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-white">
        <div className="card-header">
          <h3>Verify OTP</h3>
          <p style={{ color: "#777", fontSize: "14px" }}>Enter the 6-digit code sent to your email</p>
        </div>

        <div className="form-body">
          {/* OTP Input Boxes */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleInputChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                style={{
                  width: "40px",
                  height: "45px",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "300",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  outline: "none"
                }}
              />
            ))}
          </div>

          {error && <div className="error-box">{error}</div>}

          <button 
            className="btn-login-main" 
            onClick={verify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="signup-footer">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}