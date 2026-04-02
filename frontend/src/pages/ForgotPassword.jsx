import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("resetEmail", email); // 🔥 store email
        alert(data.msg);
        navigate("/verify");
      } else {
        alert(data.msg);
      }

    } catch {
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input 
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>
    </div>
  );
}