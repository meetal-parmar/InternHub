import { useState } from "react";

export default function Signup(){
  const [form,setForm] = useState({
    name:"", email:"", password:"", secretCode:""
  });

  const handleSubmit = async(e)=>{
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/signup",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      credentials:"include",
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(res.ok ? "Signup success" : JSON.stringify(data.errors));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Mentor Signup</h2>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
      <input placeholder="Secret Code" onChange={e=>setForm({...form,secretCode:e.target.value})}/>
      <button>Signup</button>
    </form>
  );
}