
import { useState } from "react";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import "../style/CreateIntern.css";

export default function CreateIntern() {
  const [form, setForm] = useState({
    name: "", email: "", password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/mentor/create-intern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(res.ok ? "Intern Created Successfully!" : JSON.stringify(data));
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
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email"
              placeholder="Email Address" 
              required
              onChange={e => setForm({ ...form, email: e.target.value })} 
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input 
              type="password"
              placeholder="Password" 
              required
              onChange={e => setForm({ ...form, password: e.target.value })} 
            />
          </div>

          <button type="submit" className="submit-btn">
            Create Intern
          </button>
        </form>
        
        <p className="footer-text">Manage all your interns in one place</p>
      </div>
    </div>
  );
}