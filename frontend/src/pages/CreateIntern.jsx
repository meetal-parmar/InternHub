import { useState } from "react";

export default function CreateIntern(){
  const [form,setForm] = useState({
    name:"", email:"", password:""
  });

  const handleSubmit = async(e)=>{
    e.preventDefault();

    const res = await fetch("http://localhost:3000/mentor/create-intern",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      credentials:"include",
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(res.ok ? "Intern Created" : JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Intern</h2>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
      <button>Create</button>
    </form>
  );
}