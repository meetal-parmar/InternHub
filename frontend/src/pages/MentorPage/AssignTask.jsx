import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaCloudUploadAlt } from "react-icons/fa";
import "../../style/AssignTask.css"; 
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AssignTask() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [interns, setInterns] = useState([]);
  const [errors, setErrors] = useState({}); // Validation state
  const [form, setForm] = useState({
    internId: "",
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    submissionFile: null,
  });

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/mentor/interns`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setInterns(data);
  };

  
  const validateForm = () => {
    let tempErrors = {};
    if (!form.internId) tempErrors.internId = "Please select an intern";
    if (!form.title) tempErrors.title = "Task title is required";
    if (!form.deadline) tempErrors.deadline = "Please set a deadline";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; 

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("internId", form.internId);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("deadline", form.deadline);
    formData.append("priority", form.priority);
    if (form.submissionFile) {
      formData.append("submissionFile", form.submissionFile);
    }

    const res = await fetch(`${BASE_URL}/mentor/task`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
       toast.success( "Task Created Successfully! ", {
        duration: 3000,
      });

      setForm({
        internId: "",
        title: "",
        description: "",
        deadline: "",
        priority: "Medium",
        submissionFile: null,
      });
      navigate("/mentor/tasks");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="assign-task-container">
      <div className="assign-task-card">
        <h2 className="assign-task-header">
          <FaTasks style={{ color: "#3b82f6" }} /> Assign Task
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="assign-task-grid">
            {/* Intern Selection */}
            <div className="form-group">
              <label className="form-label">
                Select Intern <span className="required-star">*</span>
              </label>
              <select
                className={`form-input ${errors.internId ? "error-border" : ""}`}
                value={form.internId}
                onChange={(e) => setForm({ ...form, internId: e.target.value })}
              >
                <option value="">Choose an intern</option>
                {interns.map((intern) => (
                  <option key={intern._id} value={intern._id}>
                    {intern.name}
                  </option>
                ))}
              </select>
              {errors.internId && <span className="error-message">{errors.internId}</span>}
            </div>

            {/* Task Title */}
            <div className="form-group">
              <label className="form-label">
                Task Title <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.title ? "error-border" : ""}`}
                placeholder="Enter task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Deadline */}
            <div className="form-group">
              <label className="form-label">
                Deadline <span className="required-star">*</span>
              </label>
              <input
                type="date"
                min={today}
                className={`form-input ${errors.deadline ? "error-border" : ""}`}
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
              {errors.deadline && <span className="error-message">{errors.deadline}</span>}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {/* Description - Full Width */}
            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Task description and instructions..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              ></textarea>
            </div>

            {/* File Upload - Full Width */}
            <div className="form-group full-width">
              <label className="form-label">
                <FaCloudUploadAlt /> Attach Reference File
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  onChange={(e) => setForm({ ...form, submissionFile: e.target.files[0] })}
                />
              </div>
            </div>
          </div>

          <div className="submit-btn-container">
            <button type="submit" className="assign-btn">
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}