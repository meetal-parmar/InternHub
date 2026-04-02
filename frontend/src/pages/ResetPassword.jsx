import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const reset = async () => {
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      alert("Session expired. Start again.");
      navigate("/forgot");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successful");
        localStorage.removeItem("resetEmail"); // 🔥 clean
        navigate("/");
      } else {
        alert(data.msg);
      }

    } catch {
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>

      <input 
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input 
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={reset}>Reset Password</button>
    </div>
  );
}