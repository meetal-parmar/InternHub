import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../style/InternTask.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  X,
  Eye,
  Calendar,
  FileText,
  Flag,
  CheckCircle,
  Paperclip,
  Clock, AlertCircle, UserCheck
} from "lucide-react";

export default function InternTaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({ totalHours: 0, daysWorked: 0, logs: [] });
  const [leaves, setLeaves] = useState([]);

  const [submission, setSubmission] = useState({
    link: "",
    notes: "",
    file: null,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const today = new Date();

      // Teeno APIs ko ek saath call kar rahe hain
      const [taskRes, attRes, leaveRes] = await Promise.all([
        axios.get("http://localhost:3000/my-tasks", { headers }),
        axios.get(`http://localhost:3000/intern/monthlySummary?month=${today.getMonth() + 1}&year=${today.getFullYear()}`, { headers }),
        axios.get("http://localhost:3000/leaves/intern", { headers })
      ]);

      setTasks(taskRes.data.tasks || []);
      setAttendanceData(attRes.data.data || { totalHours: 0, daysWorked: 0, logs: [] });
      setLeaves(leaveRes.data.history || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Punctuality Calculation (9:00 AM logic)
  // const punctuality = useMemo(() => {
  //   if (!attendanceData.logs || attendanceData.logs.length === 0) return 0;
    
  //   // 540 minutes = 9:00 AM (9 hours * 60 min)
  //   const onTimeCount = attendanceData.logs.filter(log => log.startDecimal <= 540).length;
  //   return ((onTimeCount / attendanceData.logs.length) * 100).toFixed(0);
  // }, [attendanceData]);

// useMemo ke andar check karein ki data sahi format mein hai ya nahi
const punctuality = useMemo(() => {
  // logs ab daily summary bhej raha hai jisme startDecimal hai
  const logs = attendanceData?.logs || []; 
  
  if (logs.length === 0) return 0;
  
  // 540 = 9:00 AM. 
  // Ye check karega ki us din ka pehla log 9 baje se pehle ka hai ya nahi
  const onTimeCount = logs.filter(log => 
    log.startDecimal !== undefined && log.startDecimal <= 540
  ).length;

  const percentage = (onTimeCount / logs.length) * 100;
  return Math.min(100, Math.max(0, percentage)).toFixed(0);
}, [attendanceData]);

  // 4. Upcoming Deadlines (Next 2 urgent tasks)
  const upcomingDeadlines = useMemo(() => {
    return [...tasks]
      .filter(t => t.status !== "Approved") // Jo ho chuke hain unhe hata do
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  }, [tasks]);


  // ✅ FIXED API
  // const fetchTasks = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const res = await axios.get("http://localhost:3000/my-tasks", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setTasks(res.data.tasks || []);
  //   } catch (err) {
  //     console.error("Fetch error:", err.response?.data || err.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchTasks();
  // }, []);


  const handleStartTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/task/start/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();
    } catch (err) {
      console.error("Start error:", err.response?.data || err.message);
    }
  };

  const handleSubmitTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("submissionLink", submission.link);
      formData.append("submissionNotes", submission.notes);

      if (submission.file) {
        formData.append("submissionFile", submission.file);
      }

      await axios.patch(
        `http://localhost:3000/task/submit/${selectedTask._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitModal(false);
      setSubmission({ link: "", notes: "", file: null });
      fetchData();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
    }
  };

  const handleViewTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3000/task/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedTask(res.data.task);
      setShowModal(true);
    } catch (err) {
      console.error("View error:", err.response?.data || err.message);
    }
  };

  // const filteredTasks = useMemo(() => {
  //   return tasks.filter((t) => {
  //     return (
  //       t.title.toLowerCase().includes(search.toLowerCase()) &&
  //       (statusFilter === "All" || t.status === statusFilter) &&
  //       (priorityFilter === "All" || t.priority === priorityFilter)
  //     );
  //   });
  // }, [tasks, search, statusFilter, priorityFilter]);

  // const stats = useMemo(() => {
  //   return {
  //     Pending: tasks.filter((t) => t.status === "Pending").length,
  //     "In Progress": tasks.filter((t) => t.status === "In Progress").length,
  //     Submitted: tasks.filter((t) => t.status === "Submitted").length,
  //     Approved: tasks.filter((t) => t.status === "Approved").length,
  //     Overdue: tasks.filter((t) => t.status === "Overdue").length,
  //   };
  // }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        return (
          t.title.toLowerCase().includes(search.toLowerCase()) &&
          (statusFilter === "All" || t.status === statusFilter) &&
          (priorityFilter === "All" || t.priority === priorityFilter)
        );
      })
      .sort((a, b) => b._id.localeCompare(a._id)); // Naya task upar aayega
  }, [tasks, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    return {
      Pending: tasks.filter((t) => t.status === "Pending").length,
      "In Progress": tasks.filter((t) => t.status === "In Progress").length,
      Submitted: tasks.filter((t) => t.status === "Submitted").length,
      Approved: tasks.filter((t) => t.status === "Approved").length,
      Overdue: tasks.filter((t) => t.status === "Overdue").length,
    };
  }, [tasks]);

  const COLORS = ["#f59e0b", "#3b82f6", "#6366f1", "#10b981", "#ef4444"];

  const chartData = Object.entries(stats).map(([name, value]) => ({
    name,
    value,
  }));

  const renderAction = (task) => {
    if (task.status === "Pending")
      return (
        <button
          className="start-btn"
          onClick={() => handleStartTask(task._id)}
        >
          Start
        </button>
      );

    if (["In Progress", "Overdue", "Changes Requested"].includes(task.status))
      return (
        <button
          className="submit-btn"
          onClick={() => {
            setSelectedTask(task);
            setSubmitModal(true);
          }}
        >
          Submit
        </button>
      );

    if (task.status === "Submitted")
      return <span className="review">Reviewing</span>;

    if (task.status === "Approved")
      return <span className="done">Done</span>;
  };

  return (
    <div className="task-dashboard">
      <div className="dashboard-container">
      {/* <h1 className="dashboard-title">Intern Dashboard</h1> */}

      {/* CHART */}
{/* ================= TOP STATS CARDS (3 COLUMNS) ================= */}
        <div className="top-cards" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>
          
          {/* 1. TASK OVERVIEW (Aapka existing Pie Chart) */}
          <div className="card chart-card">
            <h3 className="chart-title"><Flag size={18} style={{marginRight: '8px'}}/> Task Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend-custom">
               {chartData.map((entry, i) => (
                 <div key={i} className="legend-item">
                   <span style={{background: COLORS[i]}}></span>
                   {entry.name}
                 </div>
               ))}
            </div>
          </div>

          {/* 2. ATTENDANCE SUMMARY CARD (New Card) */}
          <div className="card active-card">
            <h3 className="active-title" style={{margin: '0 0 15px 0'}}>
              <CheckCircle size={18} style={{marginRight: '8px', color: '#10b981'}}/> Attendance Summary
            </h3>
            <div className="summary-body">
              <div className="stat-main">
                <span className="label">Present Days</span>
                <span className="value" style={{fontSize: '32px', color: '#2563eb'}}>
                  {attendanceData.daysWorked || 0}
                </span>
              </div>
              
              <div className="punctuality-meter" style={{marginTop: '20px'}}>
                <div className="flex-between">
                  <span>Punctuality</span>
                  <strong style={{color: punctuality > 90 ? '#10b981' : '#f59e0b'}}>{punctuality}%</strong>
                </div>
<div className="progress-bar-bg">
  <div 
    className="progress-fill" 
    style={{ width: `${attendanceData.logs?.length > 0 ? punctuality : 0}%` }}
  ></div>
</div>
              </div>

              <div style={{marginTop: '15px', fontSize: '13px', color: '#64748b'}}>
                Pending Leaves: <b style={{color: '#ef4444'}}>{leaves.filter(l => l.status === 'Pending').length}</b>
              </div>
            </div>
          </div>

          {/* 3. KEY DEADLINES CARD (New Card) */}
          <div className="card active-card">
            <h3 className="active-title" style={{margin: '0 0 15px 0'}}>
              <Clock size={18} style={{marginRight: '8px', color: '#ef4444'}}/> Key Deadlines
            </h3>
            <div className="deadline-list">
              {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((task, i) => (
                <div key={i} className={`deadline-box ${task.status === 'Overdue' ? 'urgent' : ''}`}>
                  <div className="deadline-info">
                    <p className="t-title">{task.title}</p>
                    <p className="t-date">
                      Due: {new Date(task.deadline).toLocaleDateString('en-GB').replace(/\//g, '-')}
                    </p>
                  </div>
                </div>
              )) : <p className="no-data">No upcoming deadlines</p>}
            </div>
          </div>
        </div>

      {/* FILTER */}
      <div className="filters">
        <input
          placeholder="Search task..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Submitted</option>
          <option>Approved</option>
          <option>Overdue</option>
        </select>

        <select onChange={(e) => setPriorityFilter(e.target.value)}>
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-container"> {/* Is wrapper ko width: 100% rakhein */}
  <table className="task-table">
    <thead>
      <tr>
        <th>Task Title</th>
        <th>Deadline</th>
        <th>Status</th>
        <th>View Details</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
{filteredTasks.map((t) => (
  <tr key={t._id}>
    <td className="task-title-cell">{t.title}</td>
    
    {/* FIXED DATE FORMAT: DD-MM-YYYY */}
<td className="date-cell">
  {new Date(t.deadline).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-')}
</td>

    <td>
      <span className={`status-pill ${t.status.toLowerCase().replace(/\s/g, "-")}`}>
        <span className="dot-indicator"></span>
        {t.status}
      </span>
    </td>

    <td>
      <button className="action-btn-view" onClick={() => handleViewTask(t._id)}>
        <Eye size={16} /> View
      </button>
    </td>

    <td>{renderAction(t)}</td>
  </tr>
))}
</tbody>
  </table>
</div>

      {/* VIEW MODAL */}
      {/* VIEW MODAL */}
{showModal && selectedTask && (
  <div className="modal-overlay">
    <div className="pro-modal">
      
      {/* FIXED HEADER */}
      <div className="modal-header">
        <div className="modal-title-flex">
          <Eye size={20} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800">Task Details</h2>
        </div>
        <button className="close-btn" onClick={() => setShowModal(false)}>
          <X size={24} />
        </button>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="modal-body custom-scrollbar">
        
        {/* TOP INFO GRID */}
        <div className="modal-grid">
          <div className="info-card">
            <span className="label"><FileText size={14}/> TASK TITLE</span>
            <p className="font-bold text-slate-700">{selectedTask.title}</p>
          </div>

          <div className="info-card">
            <span className="label"><Calendar size={14}/> DEADLINE</span>
            <p className="font-bold text-slate-700">
              {new Date(selectedTask.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>

           {/* <div className="info-card">
            <span className="label"><Flag size={14}/> PRIORITY</span>
            <span className={`tag ${selectedTask.priority?.toLowerCase()}`}>
              {selectedTask.priority}
            </span>
          </div> */}

          <div className="info-card">
  <span className="label"><Flag size={14}/> PRIORITY</span>
  <span className={`tag tag-${selectedTask.priority?.toLowerCase().trim()}`}>
    {selectedTask.priority}
  </span>
</div>

          {/* <div className="info-card">
            <span className="label"><CheckCircle size={14}/> STATUS</span>
            <span className={`tag ${selectedTask.status?.toLowerCase().replace(/\s/g,"-")}`}>
              {selectedTask.status}
            </span>
          </div>  */}

          {/* PRIORITY CARD */}
{/* <div className="info-card">
  <span className="label"><Flag size={14}/> PRIORITY</span>
  <span className={`tag tag-${selectedTask.priority?.toLowerCase().trim()}`}>
    {selectedTask.priority}
  </span>
</div> */}

{/* STATUS CARD */}
<div className="info-card">
  <span className="label"><CheckCircle size={14}/> STATUS</span>
  {/* Status के लिए status-approved, status-pending आदि बनेगा */}
  <span className={`tag status-${selectedTask.status?.toLowerCase().replace(/\s/g, "-").trim()}`}>
    {selectedTask.status}
  </span>
</div>
        </div>

        {/* DESCRIPTION */}
        <div className="modal-section description-box">
          <span className="label text-slate-500 uppercase tracking-wider">Description</span>
          <p className="text-slate-700 mt-2 whitespace-pre-wrap">{selectedTask.description}</p>
        </div>

        {/* MENTOR'S MATERIAL (Always visible if exists) */}
        {selectedTask.mentorAttachment && (
          <div className="modal-section material-box">
            <span className="label text-sky-600"><Paperclip size={14}/> MENTOR'S MATERIAL</span>
            <div className="flex items-center justify-between mt-2 bg-white p-3 rounded-lg border border-sky-100">
              {/* <span className="text-sm font-semibold text-slate-600 truncate mr-4">
                Original Task Document
              </span> */}
              <a 
                href={`http://localhost:3000/${selectedTask.mentorAttachment}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-sky-600 hover:text-sky-800 font-bold text-sm whitespace-nowrap"
              >
                Download / View
              </a>
            </div>
          </div>
        )}

        {/* FEEDBACK & REVIEWS */}
        {selectedTask.mentorFeedback && (
          <div className="feedback-box">
            <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
              <CheckCircle size={16} /> Mentor Feedback
            </div>
            <p className="text-slate-700 italic">"{selectedTask.mentorFeedback}"</p>
          </div>
        )}

        {/* TIMELINE WITH SUPPORT FILES */}
        {selectedTask.reviewHistory?.length > 0 && (
          <div className="modal-section mt-6">
            <span className="label mb-4">REVIEW HISTORY & SUPPORT FILES</span>
            <div className="timeline">
              {selectedTask.reviewHistory.map((r, i) => (
                <div key={i} className="timeline-item">
                  <div className="dot"></div>
                  <div className="timeline-content">
                    <div className="flex justify-between items-start">
                       <span className={`tag-sm ${r.decision?.toLowerCase()}`}>{r.decision}</span>
                       <span className="text-[10px] text-slate-400">Review {i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-600 my-2">{r.feedback}</p>
                    
                    {/* Support Links from Review */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {r.supportLink && (
                        <a href={r.supportLink} target="_blank" className="support-link">
                          🔗 Support Link
                        </a>
                      )}
                      {r.supportFile && (
                        <a href={`http://localhost:3000/${r.supportFile}`} target="_blank" className="support-link">
                          📄 Support Doc
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
)}

{/* SUBMIT MODAL */}
{submitModal && selectedTask && (
  <div className="modal-overlay">
    <div className="pro-modal">

      {/* HEADER */}
      <div className="modal-header">
        <div className="modal-title-flex">
          <CheckCircle size={18} />
          <h2>Submit Task</h2>
        </div>

        <button className="close-btn" onClick={() => setSubmitModal(false)}>
          <X size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="modal-body">

        <div className="modal-section">
          <span className="label">Submission Link</span>
          <input
            type="text"
            placeholder="GitHub / Live URL"
            value={submission.link}
            onChange={(e) =>
              setSubmission({ ...submission, link: e.target.value })
            }
          />
        </div>

        <div className="modal-section">
          <span className="label">Notes</span>
          <textarea
            placeholder="Explain your work..."
            value={submission.notes}
            onChange={(e) =>
              setSubmission({ ...submission, notes: e.target.value })
            }
          />
        </div>

        <div className="modal-section">
          <span className="label">Upload File</span>
          <input
            type="file"
            onChange={(e) =>
              setSubmission({ ...submission, file: e.target.files[0] })
            }
          />
        </div>

        <button className="submit-btn full" onClick={handleSubmitTask}>
          Submit Now
        </button>

      </div>
    </div>
  </div>
)}
    </div>
    </div>
  );
}