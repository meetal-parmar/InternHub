import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import "../style/CreateIntern.css";
import { useNavigate } from "react-router-dom";


export default function CreateIntern() {
  // 2. Initialize the navigate function
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/mentor/create-intern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

if (res.ok) {
  toast.success("Intern Created Successfully!");
  setForm({ name: "", email: "", password: "" });
  setErrors({});
  setTimeout(() => navigate("/mentor/interns"), 1000);
} else {
  setErrors(data.errors || {});
  
  const errorMsg =
    data?.message ||
    Object.values(data?.errors || {}).join(", ") ||
    "Something went wrong";

  toast.error(errorMsg);
}
    } catch (error) {
      toast.error("Failed to connect to server");
    }
  };

  return (
    <div className="create-intern-container">
      <div className="create-card">
        <div className="create-header">
          <h2>Create Intern</h2>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          {errors.name && <p className="error-text">{errors.name}</p>}

          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" className="submit-btn">
            Create Intern
          </button>
        </form>

        <p className="footer-text">
          Manage all your interns in one place
        </p>
      </div>
    </div>
  );
}