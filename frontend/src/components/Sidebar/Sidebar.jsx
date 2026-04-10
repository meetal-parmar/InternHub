import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuCalendarCheck, LuUsers,
  LuFileText, LuFileCheck, LuLogOut ,LuHistory,LuListTodo
} from 'react-icons/lu'; 
import './Sidebar.css';

const Sidebar = () => {
  const links = [
    { to: "/mentor-dashboard", label: "DashBoard", icon: <LuLayoutDashboard /> },
    // { to: "/profile", label: "Profile", icon: <LuUser /> },
    { to: "/mentor/interns", label: "My Interns", icon: <LuUsers /> },
    { to: "/mentor/tasks", label: "Tasks", icon: <LuListTodo /> },
    { to: "/mentor/materials", label: "Materials", icon: <LuFileText /> },
    { to: "/mentor/reviews", label: "Review Task", icon: <LuFileCheck /> },
     { to: "/mentor/timeline", label: "Intern TimeLog", icon: <LuHistory /> },
      { to: "/mentor/timline", label: "Monthly summary", icon: <LuHistory /> },
     { to: "/mentor/leaves", label: "Leave Manegement", icon: <LuCalendarCheck /> },
  ];

  return (
    <div className="sidebar-container">
      {/* Original Logo Style */}
      <div className="sidebar-logo">Mentor<span>Panel</span></div>
      
      <nav className="sidebar-nav">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => isActive ? "active" : ""}>
                <span className="icon-wrapper">
                  <span className="icon">{link.icon}</span>
                </span>
                <span className="nav-label">{link.label}</span>
              </NavLink>
            </li>
          ))}
          
          {/* <li className="logout-li">
            <NavLink to="/login" className="logout-btn">
              <span className="icon-wrapper"><LuLogOut /></span>
              <span className="nav-label">Logout</span>
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;