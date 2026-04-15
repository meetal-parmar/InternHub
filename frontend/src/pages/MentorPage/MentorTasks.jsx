
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit3, FiTrash2, FiCalendar, FiUser, FiFlag, FiCheckCircle, FiFileText, FiPaperclip,FiX} from "react-icons/fi";
import "../../style/MentorTasks.css"; 
import "../../style/AssignTask.css";

export default function MentorTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "", description: "", deadline: "", priority: "Medium",
  });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/mentor/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setTasks(data.tasks);
  };

  const openEdit = (task) => {
    setEditingTask(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline.split("T")[0],
      priority: task.priority,
    });
  };

  const saveEdit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/mentor/task/${editingTask}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditingTask(null);
      fetchTasks();
    }
  };

  const deleteTask = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:3000/mentor/task/${deleteTaskId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (res.ok) {
    setDeleteTaskId(null);
    fetchTasks();
  }
};

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.internId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="tasks-container">
      <div className="content-wrapper">
        <div className="tasks-header">
          <h1>All Tasks</h1>
          <button className="btn-create" onClick={() => navigate("/mentor/assign-task")}>
            + Create Task
          </button>
        </div>

        <div className="controls-bar">
          <input 
            type="text" placeholder="Search task or intern..." className="search-input"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Approved">Approved</option>
            <option value="Submitted">Submitted</option>
            <option value="Changes Requested">Changes Requested</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th className="col-title">Task Title</th>
                <th className="col-intern">Intern</th>
                <th className="col-deadline">Deadline</th>
                <th className="col-priority">Priority</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td className="task-title">{task.title}</td>
                  <td className="intern-name">{task.internId?.name || "-"}</td>
                  <td>{new Date(task.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</td>
                 <td>
  <span
    className={`status-pill ${task.status
      .toLowerCase()
      .replace(/\s+/g, "-")}`}
  >
    {task.status}
  </span>
</td>
                  <td className="col-actions">
                    <div className="actions-cell">
                    <button className="action-btn btn-view"  title="View Details"onClick={() => setViewTask(task)}> <FiEye /></button>
                      <button className="action-btn btn-edit" title="Edit Task" onClick={() => openEdit(task)}><FiEdit3 /></button>
                      <button className="action-btn btn-delete" title="Delete Task" onClick={() => setDeleteTaskId(task._id)} ><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

   {editingTask && (
  <div className="modal-overlay">
    <div className="assign-task-card edit-task-card">
      <h2 className="assign-task-header">
        <FiEdit3 style={{ color: "#3b82f6" }} /> Edit Task
      </h2>

      <div className="assign-task-grid">
        {/* Title */}
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-input"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
          />
        </div>

        {/* Deadline */}
        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            className="form-input"
            value={editForm.deadline}
            onChange={(e) =>
              setEditForm({ ...editForm, deadline: e.target.value })
            }
          />
        </div>

        {/* Priority */}
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            className="form-input"
            value={editForm.priority}
            onChange={(e) =>
              setEditForm({ ...editForm, priority: e.target.value })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows="4"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="submit-btn-container edit-btns">
        <button className="assign-btn" onClick={saveEdit}>
          Update Task
        </button>

        <button
          className="assign-btn cancel-btn"
          onClick={() => setEditingTask(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


{viewTask && (
  <div className="modal-overlay">
    <div className="task-view-card">
      <div className="task-view-header">
        <div className="view-title-wrap">
          <FiEye className="view-main-icon" />
          <h2>Task Details</h2>
        </div>

        <button
          className="close-view-btn"
          onClick={() => setViewTask(null)}
        >
          <FiX />
        </button>
      </div>

      <div className="task-view-body">
        <div className="detail-card">
          <span><FiFileText /> Task Title</span>
          <p>{viewTask.title}</p>
        </div>

        <div className="detail-card">
          <span><FiUser /> Intern</span>
          <p>{viewTask.internId?.name || "-"}</p>
        </div>

        <div className="detail-card">
          <span><FiCalendar /> Deadline</span>
          <p>
            {new Date(viewTask.deadline).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="detail-card">
          <span><FiFlag /> Priority</span>
          <p className={`priority-pill ${viewTask.priority.toLowerCase()}`}>
            {viewTask.priority}
          </p>
        </div>
<div className="detail-card">
  <span><FiCheckCircle /> Status</span>
  {/* 'status-pill' ke saath direct status class attach karein */}
 <p className={`status-pill ${viewTask.status.toLowerCase().replace(/\s+/g, "-")}`}>
    {viewTask.status}
  </p>
</div>

        <div className="detail-card full-width">
          <span><FiFileText /> Description</span>
          <p>{viewTask.description || "No description provided"}</p>
        </div>

        <div className="detail-card full-width">
          <span><FiPaperclip /> Attached File</span>
          {viewTask.mentorAttachment ? (
            <a
              href={`http://localhost:3000/${viewTask.mentorAttachment}`}
              target="_blank"
              rel="noreferrer"
              className="file-link"
            >
              📎 Open Attached File
            </a>
          ) : (
            <p>No file attached</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}

{deleteTaskId && (
  <div className="modal-overlay">
    <div className="delete-modal">
      <div className="delete-icon-box">
        <FiTrash2 />
      </div>

      <h3>Delete Task?</h3>
      <p>
        This action cannot be undone. The selected task will be permanently removed.
      </p>

      <div className="delete-actions">
        <button className="cancel-delete-btn" onClick={() => setDeleteTaskId(null)}>
          Cancel
        </button>

        <button className="confirm-delete-btn" onClick={deleteTask}>
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}