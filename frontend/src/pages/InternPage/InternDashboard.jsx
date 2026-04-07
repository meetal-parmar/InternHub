import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InternDashboard(){
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
      <button onClick={logout}>Logout</button>
      <div>
        <button onClick={()=>navigate("/profile")}>Profile</button>
      </div>
      <div>
        <button onClick={()=>navigate("/timelog")}>timelog</button>
      </div>
      <div>
        <button onClick={()=>navigate("/monthlySummary")}>monthlySummary</button>
      </div>
    </div>

    
  );
}