// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Eye, Trash2, Search, Filter } from "lucide-react";
// import "../../style/MentorInterns.css";

// export default function MentorInterns() {
//   const navigate = useNavigate();
//   const [interns, setInterns] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");

//   useEffect(() => { 
//     fetchInterns();
//   }, []);

//   const fetchInterns = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:3000/mentor/interns", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok) setInterns(data);
//     } catch (error) {
//       console.error("Error fetching interns:", error);
//     }
//   };
// const getInternStatus = (intern) => {
//   const today = new Date();

//   // 1) manual inactive
//   if (intern.isActive === false) {
//     return "INACTIVE";
//   }

//   // 2) no profile = ACTIVE (as per your requirement)
//   if (!intern.profile) {
//     return "ACTIVE";
//   }

//   // 3) date based inactive
//   const endDate = new Date(intern.profile.internshipEndDate);

//   if (today >= endDate) {
//     return "INACTIVE";
//   }

//   return "ACTIVE";
// };
//   const makeInactive = async (id) => {
//     if (!window.confirm("Are you sure you want to make this intern inactive manually?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`http://localhost:3000/mentor/intern/${id}/inactive`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) fetchInterns();
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "—";
//     return new Date(date).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const calculateProgress = (profile) => {
//     if (!profile) return 0;
//     const start = new Date(profile.internshipStartDate);
//     const end = new Date(profile.internshipEndDate);
//     const today = new Date();
//     const total = end - start;
//     const current = today - start;
//     let progress = Math.round((current / total) * 100);
//     return Math.max(0, Math.min(100, progress));
//   };

//   // FILTERED INTERNS BASED ON SEARCH AND STATUS
//   // const filteredInterns = interns.filter((intern) => {
//   //   const nameMatch = intern.name.toLowerCase().includes(searchTerm.toLowerCase());

//   //   const hasProfile = !!intern.profile;
//   //   const today = new Date();
//   //   const endDate = hasProfile ? new Date(intern.profile.internshipEndDate) : null;
//   //   const isCompleted = endDate && today >= endDate;

//   //   let statusText = "PENDING";
//   //   if (hasProfile) {
//   //     statusText = isCompleted ? "INACTIVE" : "ACTIVE";
//   //   }

//   //   const statusMatch =
//   //     statusFilter === "All" ? true : statusText === statusFilter.toUpperCase();

//   //   return nameMatch && statusMatch;
//   // });

//  const filteredInterns = interns.filter((intern) => {
//   const nameMatch = intern.name
//     .toLowerCase()
//     .includes(searchTerm.toLowerCase());

//   const hasProfile = !!intern.profile;
//   const today = new Date();
//   const endDate = hasProfile
//     ? new Date(intern.profile.internshipEndDate)
//     : null;

//   const isCompleted = endDate && today >= endDate;

//   let statusText = "ACTIVE";

//   if (intern.isActive === false || (hasProfile && isCompleted)) {
//     statusText = "INACTIVE";
//   }

//   const statusMatch =
//     statusFilter === "All"
//       ? true
//       : statusText === statusFilter.toUpperCase();

//   return nameMatch && statusMatch;
// });
//   return (
//     <div className="main-content">
//       {/* Top Header */}
//       <div className="top-bar">
//         <h2>My Interns</h2>
//         <button
//           className="create-btn"
//           onClick={() => navigate("/create-intern")}
//         >
//           + Create Intern
//         </button>
//       </div>

//       {/* Search + Filter Row */}
//       <div className="filter-row">
//         <div className="search-wrapper">
//           <Search size={16} className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search interns..."
//             className="search-input"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <select
//           className="filter-select"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="All">All</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
         
//         </select>

//         <button className="filter-btn">
//           <Filter size={16} /> Filter
//         </button>
//       </div>

//       {/* Table */}
//       <div className="table-wrapper">
//         <table className="full-width-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Created At</th>
//               <th>Progress</th>
//               <th>Status</th>
//               <th className="text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredInterns.length > 0 ? (
//               filteredInterns.map((intern) => {
//                 const hasProfile = !!intern.profile;
//                 const progress = calculateProgress(intern.profile);

//                 const today = new Date();
//                 const endDate = hasProfile ? new Date(intern.profile.internshipEndDate) : null;
//                 const isCompleted = endDate && today >= endDate;

//              let statusClass = "active";
// let statusText = "ACTIVE";

// if (intern.isActive === false || (hasProfile && isCompleted)) {
//   statusClass = "inactive";
//   statusText = "INACTIVE";
// }

//                 return (
//                   <tr key={intern._id}>
//                     <td className="name-col"><strong>{intern.name}</strong></td>
//                     <td>{intern.email}</td>
//                     <td>{formatDate(intern.createdAt || intern.created_at)}</td>
//                     <td>
//                       <div className="progress-flex">
//                         <div className="progress-bg">
//                           <div className="progress-fill" style={{ width: `${progress}%` }}></div>
//                         </div>
//                         <span className="progress-val">{progress}%</span>
//                       </div>
//                     </td>
//                     <td>
//                       <span className={`status-badge ${statusClass}`}>
//                         {statusText}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="action-flex">
//                         <button className="icon-btn edit-icon" onClick={() => navigate(`/mentor/intern/${intern._id}`)}>
//                           <Eye size={18} />
//                         </button>
//                         <button className="icon-btn delete-icon" onClick={() => makeInactive(intern._id)}>
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="6" className="no-data">No interns found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, Trash2, Search, Filter } from "lucide-react";
import "../../style/MentorInterns.css";

export default function MentorInterns() {
  const navigate = useNavigate();

  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInternId, setSelectedInternId] = useState(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/mentor/interns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setInterns(data);
      }
    } catch (error) {
      console.error("Error fetching interns:", error);
    }
  };

  // SINGLE SOURCE STATUS LOGIC
  const getInternStatus = (intern) => {
  // 1) manual inactive
  if (intern.isActive === false) {
    return "INACTIVE";
  }

  const profile = intern.profile;

  // 2) no profile OR incomplete profile
  if (
    !profile ||
    !profile.internshipStartDate ||
    !profile.internshipEndDate
  ) {
    return "PENDING";
  }

  const today = new Date();
  const startDate = new Date(profile.internshipStartDate);
  const endDate = new Date(profile.internshipEndDate);

  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // 3) internship completed
  if (today > endDate) {
    return "INACTIVE";
  }

  // 4) valid active internship
  return "ACTIVE";
};

const getStatusStyle = (status) => {
  if (status === "ACTIVE") {
    return {
      background: "#dcfce7",
      color: "#15803d",
    };
  }

  if (status === "INACTIVE") {
    return {
      background: "#fee2e2",
      color: "#b91c1c",
    };
  }

  return {
    background: "#fef3c7",
    color: "#b45309",
  };
};
 const makeInactive = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/mentor/interns/${selectedInternId}/inactive`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      fetchInterns();
      setShowConfirmModal(false);
      setSelectedInternId(null);
    }
  } catch (error) {
    console.error("Error updating intern status:", error);
  }
};

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateProgress = (profile) => {
    if (!profile) return 0;

    const start = new Date(profile.internshipStartDate);
    const end = new Date(profile.internshipEndDate);
    const today = new Date();

    const totalDuration = end - start;
    const completedDuration = today - start;

    let progress = Math.round(
      (completedDuration / totalDuration) * 100
    );

    return Math.max(0, Math.min(100, progress));
  };

  // FILTERING
  const filteredInterns = interns.filter((intern) => {
    const nameMatch = intern.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const statusText = getInternStatus(intern);
    //console.log(intern.name, statusText);

    const statusMatch =
      statusFilter === "All"
        ? true
        : statusText === statusFilter.toUpperCase();

    return nameMatch && statusMatch;
  });

  return (
    <div className="main-content">
      {/* HEADER */}
      <div className="top-bar">
        <h2>My Interns</h2>

        <button
          className="create-btn"
          onClick={() => navigate("/create-intern")}
        >
          + Create Intern
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="filter-row">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />

          <input
            type="text"
            placeholder="Search interns..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
  className="filter-select"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="All">All</option>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
  <option value="Pending">Pending</option>
</select>

        <button className="filter-btn">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="full-width-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Progress</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInterns.length > 0 ? (
              filteredInterns.map((intern) => {
                const progress = calculateProgress(
                  intern.profile
                );

                const statusText = getInternStatus(intern);

              const statusClass =
  statusText === "ACTIVE"
    ? "status-active"
    : "status-inactive";

                return (
                  <tr key={intern._id}>
                    <td className="name-col">
                      <strong>{intern.name}</strong>
                    </td>

                    <td>{intern.email}</td>

                    <td>
                      {formatDate(
                        intern.createdAt || intern.created_at
                      )}
                    </td>

                    <td>
                      <div className="progress-flex">
                        <div className="progress-bg">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${progress}%`,
                            }}
                          ></div>
                        </div>

                        <span className="progress-val">
                          {progress}%
                        </span>
                      </div>
                    </td>

                    {/* <td>
  <span className={`status-badge ${statusClass}`}>
    {statusText}
  </span>
</td> */}
<td>
  <span
    style={{
      ...getStatusStyle(statusText),
      padding: "6px 15px",
      borderRadius: "999px",
      fontWeight: "700",
      fontSize: "12px",
      display: "inline-block",
      minWidth: "95px",
    }}
  >
    {statusText}
  </span>
</td>
                    <td>
                      <div className="action-flex">
                        <button
                          className="icon-btn edit-icon"
                          onClick={() =>
                            navigate(
                              `/mentor/intern/${intern._id}`
                            )
                          }
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          className="icon-btn delete-icon"
                          onClick={() => {
  setSelectedInternId(intern._id);
  setShowConfirmModal(true);
}}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No interns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Make Intern Inactive</h3>
            <p>Are you sure you want to make this intern inactive?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={makeInactive}
              >
                Yes, Inactive
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
