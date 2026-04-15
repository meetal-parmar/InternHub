
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";
// import {
//   FaUsers,
//   FaUserCheck,
//   FaUserClock,
//   FaTasks,
//   FaBell,
// } from "react-icons/fa";
// import "../../style/MentorDashboard.css";

// const MentorDashboard = () => {
//   const [stats, setStats] = useState({});
//   const [trends, setTrends] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//   fetchDashboard();

//   const interval = setInterval(() => {
//     fetchDashboard();
//   }, 3000); 

//   return () => clearInterval(interval);
// }, []);

//   const fetchDashboard = async () => {
//     const token = localStorage.getItem("token");
//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };

//     const [statsRes, trendRes, notifRes] = await Promise.all([
//       axios.get("http://localhost:3000/api/mentor-dashboard/stats", { headers }),
//       axios.get("http://localhost:3000/api/mentor-dashboard/attendance-trends", { headers }),
//       axios.get("http://localhost:3000/api/mentor-dashboard/notifications", { headers }),
//     ]);

//     setStats(statsRes.data.stats);
//     setTrends(trendRes.data.trends);
//     setNotifications(notifRes.data.notifications);
//   };

//   const cards = [
//     { title: "Total Interns", value: stats.totalInterns, icon: <FaUsers /> },
//     { title: "Today's Present", value: stats.presentInterns, icon: <FaUserCheck /> },
//     { title: "On Leave", value: stats.onLeaveInterns, icon: <FaUserClock /> },
//     { title: "Task Submission", value: stats.newTaskSubmission, icon: <FaTasks /> },
//     { title: "Leave Requests", value: stats.newLeaveApply, icon: <FaBell /> },
//   ];

//   return (
//     <div className="mentor-dashboard">
//       {/* <div className="dashboard-header">
//         <h2>Welcome, Mentor 👋</h2>
//       </div> */}

//       <div className="kpi-grid">
//         {cards.map((card, index) => (
//           <div key={index} className="kpi-card">
//             <div className="kpi-icon">{card.icon}</div>
//             <p>{card.title}</p>
//             <h2>{card.value || 0}</h2>
//           </div>
//         ))}
//       </div>

      

//       <div className="dashboard-main">
//         <div className="chart-box">
//           <h3>Attendance Trends</h3>
//           <ResponsiveContainer width="100%" height={320}>
//             <AreaChart data={trends}>
//               <defs>
//                 <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="present"
//                 stroke="#2563eb"
//                 fill="url(#blueFill)"
//                 strokeWidth={3}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="notification-center">
//           <h3>Notification Center</h3>

//           {notifications.length === 0 ? (
//             <p className="empty">No pending notifications</p>
//           ) : (
//             notifications.map((item) => (
//               <div key={item._id} className="notification-card">
//                 <h4>{item.title}</h4>
//                 <p>{item.message}</p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaTasks,
  FaBell,
} from "react-icons/fa";
import "../../style/MentorDashboard.css";

const MentorDashboard = () => {
  const [stats, setStats] = useState({});
  const [trends, setTrends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [todayLeaves, setTodayLeaves] = useState([]); // ✅ FIXED

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsRes, trendRes, notifRes, leavesRes] = await Promise.all([
        axios.get("http://localhost:3000/api/mentor-dashboard/stats", {
          headers,
        }),
        axios.get(
          "http://localhost:3000/api/mentor-dashboard/attendance-trends",
          { headers }
        ),
        axios.get("http://localhost:3000/api/mentor-dashboard/notifications", {
          headers,
        }),
        axios.get("http://localhost:3000/leaves/mentor", { headers }), // ✅ leave list
      ]);

      setStats(statsRes.data.stats);
      setTrends(trendRes.data.trends);
      setNotifications(notifRes.data.notifications);

      // ✅ filter today's approved leaves
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysLeaves = leavesRes.data.filter((leave) => {
        const from = new Date(leave.fromDate);
        const to = new Date(leave.toDate);

        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        return (
          leave.status === "Approved" &&
          today >= from &&
          today <= to
        );
      });

      setTodayLeaves(todaysLeaves);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  const cards = [
    {
      title: "Total Interns",
      value: stats.totalInterns,
      icon: <FaUsers />,
    },
    {
      title: "Today's Present",
      value: stats.presentInterns,
      icon: <FaUserCheck />,
    },
    {
      title: "On Leave",
      value: stats.onLeaveInterns,
      icon: <FaUserClock />,
    },
    {
      title: "Task Submission",
      value: stats.newTaskSubmission,
      icon: <FaTasks />,
    },
    {
      title: "Leave Requests",
      value: stats.newLeaveApply,
      icon: <FaBell />,
    },
  ];

  return (
    <div className="mentor-dashboard">
      <div className="kpi-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`kpi-card ${
              card.title === "On Leave" ? "leave-hover-card" : ""
            }`}
          >
            <div className="kpi-icon">{card.icon}</div>
            <p>{card.title}</p>
            <h2>{card.value || 0}</h2>

            {/* ✅ Hover list only on On Leave */}
            {card.title === "On Leave" && (
              <div className="leave-hover-list">
                <h4>Today's Leave</h4>
                {todayLeaves.length > 0 ? (
                  todayLeaves.map((leave) => (
                    <p key={leave._id}>{leave.internId?.name}</p>
                  ))
                ) : (
                  <p>No one is on leave</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="dashboard-main">
        <div className="chart-box">
          <h3>Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="present"
                stroke="#2563eb"
                fill="url(#blueFill)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="notification-center">
          <h3>Notification Center</h3>

          {notifications.length === 0 ? (
            <p className="empty">No pending notifications</p>
          ) : (
            notifications.map((item) => (
              <div key={item._id} className="notification-card">
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;