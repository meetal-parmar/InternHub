import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileMentor from "../../components/profile/ProfileMentor";

export default function MentorDashboard(){
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

//       {console.log(user._id);
//       console.log(user.role);
//       console.log(user.email);
// }

  return (
    <div>
      <h2>Welcome {user?.email}</h2>

      {user?.role === "MENTOR" && (
        <button onClick={()=>navigate("/create-intern")}>
          Create Intern
        </button>
      )}

      <button onClick={logout}>Logout</button>
      <div>
        <button onClick={()=>navigate("/profile")}>Profile</button>
      </div>
    </div>
  );
}