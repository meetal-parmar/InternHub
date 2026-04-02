import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verify = async () => {
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      alert("Email missing. Start again.");
      navigate("/forgot");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP Verified");
        navigate("/reset");
      } else {
        alert(data.msg || data.error || "Something went wrong");
      }

    } catch {
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input 
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verify}>Verify</button>
    </div>
  );
}