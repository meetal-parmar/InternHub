// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
// import "../../style/MentorLeavesPage.css";

// const BASE_URL = "http://localhost:3000";

// const MentorLeavesPage = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [selectedLeave, setSelectedLeave] = useState(null);

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   const fetchLeaves = async () => {
//     const token = localStorage.getItem("token");
//     const res = await axios.get(`${BASE_URL}/leaves/mentor`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setLeaves(res.data);
//   };

//   const updateStatus = async (leaveId, status) => {
//     const token = localStorage.getItem("token");

//     await axios.post(
//       `${BASE_URL}/leaves/status`,
//       { leaveId, status },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     setLeaves((prev) =>
//       prev.map((leave) =>
//         leave._id === leaveId ? { ...leave, status } : leave
//       )
//     );
//   };

//   const filteredLeaves = useMemo(() => {
//     if (filter === "All") return leaves;
//     return leaves.filter((leave) => leave.status === filter);
//   }, [leaves, filter]);

//   const leaveCountByIntern = useMemo(() => {
//     const map = {};
//     leaves.forEach((leave) => {
//       const name = leave.internId?.name || "Unknown";
//       map[name] = (map[name] || 0) + 1;
//     });
//     return map;
//   }, [leaves]);

//   return (
//     <div className="mentor-leaves-page">
//       <div className="leave-header">
//         <h2>Leave Management</h2>

//         <div className="filters">
//           {["All", "Pending", "Approved", "Rejected"].map((item) => (
//             <button
//               key={item}
//               className={filter === item ? "active" : ""}
//               onClick={() => setFilter(item)}
//             >
//               {item}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="leave-table-wrapper">
//         <table className="leave-table">
//           <thead>
//             <tr>
//               <th>Intern</th>
//               <th>Email</th>
//               <th>Type</th>
//               <th>Days</th>
//               <th>Leaves Taken</th>
//               <th>Status</th>
//               <th>From</th>
//               <th>To</th>
//               <th>View</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredLeaves.map((leave) => (
//               <tr key={leave._id}>
//                 <td>{leave.internId?.name}</td>
//                 <td>{leave.internId?.email}</td>
//                 <td>{leave.type}</td>
//                 <td>{leave.days}</td>
//                 <td>{leaveCountByIntern[leave.internId?.name]}</td>
//                 <td>
//                   <span className={`status ${leave.status.toLowerCase()}`}>
//                     {leave.status}
//                   </span>
//                 </td>
//                 <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
//                 <td>{new Date(leave.toDate).toLocaleDateString()}</td>
//                 <td>
//                   <button
//                     className="icon-btn view"
//                     onClick={() => setSelectedLeave(leave)}
//                   >
//                     <FaEye />
//                   </button>
//                 </td>
//                 <td>
//                   {leave.status === "Pending" && (
//                     <div className="action-btns">
//                       <button
//                         className="icon-btn approve"
//                         onClick={() => updateStatus(leave._id, "Approved")}
//                       >
//                         <FaCheck />
//                       </button>
//                       <button
//                         className="icon-btn reject"
//                         onClick={() => updateStatus(leave._id, "Rejected")}
//                       >
//                         <FaTimes />
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedLeave && (
//         <div className="leave-modal-overlay">
//           <div className="leave-modal">
//             <h3>Leave Details</h3>
//             <p><strong>Intern:</strong> {selectedLeave.internId?.name}</p>
//             <p><strong>Reason:</strong> {selectedLeave.reason}</p>
//             <p><strong>Type:</strong> {selectedLeave.type}</p>
//             <p><strong>Status:</strong> {selectedLeave.status}</p>
//             <button onClick={() => setSelectedLeave(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MentorLeavesPage;


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import "../../style/MentorLeavesPage.css";

const BASE_URL = "http://localhost:3000";

const MentorLeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/leaves/mentor`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLeaves(res.data);
  };

  // const updateStatus = async (leaveId, status) => {
  //   const token = localStorage.getItem("token");

  //   await axios.post(
  //     `${BASE_URL}/leaves/status`,
  //     { leaveId, status },
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );

  //   // ✅ instant UI sync
  //   await fetchLeaves();
  // };

const updateStatus = async (leaveId, status) => {
  const token = localStorage.getItem("token");

  await axios.post(
    `${BASE_URL}/leaves/status`,
    { leaveId, status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // remove from list instantly
  setLeaves((prev) =>
    prev.filter((leave) => leave._id !== leaveId)
  );
};


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const filteredLeaves = useMemo(() => {
  let filtered =
    filter === "All"
      ? [...leaves]
      : leaves.filter((leave) => leave.status === filter);

  return filtered.sort(
    (a, b) =>
      new Date(b.createdAt || b.fromDate) -
      new Date(a.createdAt || a.fromDate)
  );
}, [leaves, filter]);

  const leaveCountByIntern = useMemo(() => {
    const map = {};
    leaves.forEach((leave) => {
      const name = leave.internId?.name || "Unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return map;
  }, [leaves]);

  return (
    <div className="mentor-leaves-page">
      <div className="leave-header">
        <h2>Leave Management</h2>

        <div className="filters">
          {["All", "Pending", "Approved", "Rejected"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="leave-table-wrapper">
        <table className="leave-table">
          <thead>
            <tr>
              <th>Intern</th>
              <th>Email</th>
              <th>Type</th>
              <th>Days</th>
              <th>Leaves Taken</th>
              <th>Status</th>
              <th>From</th>
              <th>To</th>
              <th>View</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.internId?.name}</td>
                <td>{leave.internId?.email}</td>
                <td>{leave.type}</td>
                <td>{leave.days}</td>
                <td>{leaveCountByIntern[leave.internId?.name]}</td>
                <td>
                  <span className={`status ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </td>
                <td>{formatDate(leave.fromDate)}</td>
                <td>{formatDate(leave.toDate)}</td>
                <td>
                  <button
                    className="icon-btn view"
                    onClick={() => setSelectedLeave(leave)}
                  >
                    <FaEye />
                  </button>
                </td>
                <td>
                  {leave.status === "Pending" && (
                    <div className="action-btns">
                      <button
                        className="icon-btn approve"
                        onClick={() => updateStatus(leave._id, "Approved")}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="icon-btn reject"
                        onClick={() => updateStatus(leave._id, "Rejected")}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLeave && (
        <div className="leave-modal-overlay">
          <div className="leave-modal">
            <h3>Leave Details</h3>
            <p><strong>Intern:</strong> {selectedLeave.internId?.name}</p>
            <p><strong>Reason:</strong> {selectedLeave.reason}</p>
            <p><strong>Type:</strong> {selectedLeave.type}</p>
            <p><strong>Status:</strong> {selectedLeave.status}</p>
            <p><strong>From:</strong> {formatDate(selectedLeave.fromDate)}</p>
            <p><strong>To:</strong> {formatDate(selectedLeave.toDate)}</p>
            <button
              className="close-btn"
              onClick={() => setSelectedLeave(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorLeavesPage;