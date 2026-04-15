import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuUser, LuClipboardList, LuUsers,

  LuFileText, LuFileCheck, LuTrendingUp ,LuHistory,LuListTodo,LuCalendarCheck 
} from 'react-icons/lu'; 
import './Sidebar.css';

const Sidebar = () => {

  const role = localStorage.getItem("role");

  const mentorLinks = [
    { to: "/mentor-dashboard", label: "DashBoard", icon: <LuLayoutDashboard /> },
    // { to: "/profile", label: "Profile", icon: <LuUser /> },
    { to: "/mentor/interns", label: "My Interns", icon: <LuUsers /> },
    { to: "/mentor/tasks", label: "Tasks", icon: <LuListTodo /> },
    { to: "/mentor/materials", label: "Materials", icon: <LuFileText /> },
    { to: "/mentor/reviews", label: "Review Task", icon: <LuFileCheck /> },
    { to: "/mentor/timeline", label: "Intern TimeLog", icon: <LuHistory /> },
    { to: "/mentor/monthlySummary", label: "Monthly Summary", icon: <LuTrendingUp /> },
        { to: "/mentor/leaves", label: "Leave Manegement", icon: <LuCalendarCheck /> }
  ];

  const internLinks = [
    { to: "/intern-dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { to: "/profile", label: "Profile", icon: <LuUser /> },
    { to: "/timelog", label: "TimeLog", icon: <LuClipboardList /> },
    { to: "/monthlySummary", label: "Monthly Summary", icon: <LuHistory /> },
    { to: "/materials", label: "Materials", icon: <LuFileText /> },
    { to: "/leaves", label: "Leaves", icon: <LuFileCheck /> }
    
    // { to: "/task", label: "Task", icon: <LuListTodo /> }

  ];
  const panelTitle =
    role === "MENTOR" ? "Mentor Panel" :
    role === "INTERN" ? "Intern Panel" :
    "Panel";

const links = role === "MENTOR" ? mentorLinks : role === "INTERN" ? internLinks : [];
  return (
    <div className="sidebar-container">
      {/* Original Logo Style */}
      <div className="sidebar-logo">
        {panelTitle.split(" ")[0]}<span> {panelTitle.split(" ")[1]}</span>
      </div>      
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
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;