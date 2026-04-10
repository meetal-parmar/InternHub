import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuUser, LuClipboardList, LuUsers,
  LuFileText, LuFileCheck, LuLogOut ,LuHistory,LuListTodo
} from 'react-icons/lu'; 
import './Sidebar.css';

const Sidebar = () => {
  const role = localStorage.getItem("role");

  const mentorLinks = [
    { to: "/mentor-dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { to: "/profile", label: "Profile", icon: <LuUser /> },
    { to: "/mentor/interns", label: "My Interns", icon: <LuUsers /> },
    { to: "/mentor/tasks", label: "Tasks", icon: <LuListTodo /> },
    { to: "/mentor/materials", label: "Materials", icon: <LuFileText /> },
    { to: "/mentor/reviews", label: "Review Task", icon: <LuFileCheck /> },
    { to: "/mentor/timeline", label: "Intern TimeLog", icon: <LuHistory /> },
    { to: "/mentor/monthlySummary", label: "Monthly Summary", icon: <LuHistory /> },
  ];

  const internLinks = [
    { to: "/intern-dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { to: "/profile", label: "Profile", icon: <LuUser /> },
    { to: "/timelog", label: "TimeLog", icon: <LuClipboardList /> },
    { to: "/monthlySummary", label: "Monthly Summary", icon: <LuHistory /> },
    { to: "/leaves", label: "Leaves", icon: <LuFileCheck /> },
    { to: "/materials", label: "Materials", icon: <LuFileText /> },
    // { to: "/task", label: "Task", icon: <LuListTodo /> }
  ];

const links = role === "MENTOR" ? mentorLinks : role === "INTERN" ? internLinks : [];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">Intern<span>Hub</span></div>

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

          <li className="logout-li">
            <NavLink to="/login" className="logout-btn">
              <span className="icon-wrapper"><LuLogOut /></span>
              <span className="nav-label">Logout</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;