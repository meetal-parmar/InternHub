import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();

  const logout = async ()=>{
    await fetch("http://localhost:3000/auth/logout",{
      method:"POST",
      credentials:"include"
    });
    dispatch({type:"LOGOUT"});
    navigate("/");
  };

  return (
    <div>
      <h2>Welcome {user?.email}</h2>

      {user?.role === "MENTOR" && (
        <button onClick={()=>navigate("/create-intern")}>
          Create Intern
        </button>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}