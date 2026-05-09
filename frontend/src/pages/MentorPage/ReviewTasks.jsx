

import { useEffect, useState } from "react";
import {
  FiEye,
  FiCheckCircle,
  FiRefreshCcw,
  FiPaperclip,
  FiX,
  FiClock
} from "react-icons/fi";
import "../../style/MentorTasks.css";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function ReviewTasks() {
  const [tasks, setTasks] = useState([]);
  const [viewTask, setViewTask] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    feedback: "",
    supportLink: "",
    supportFile: null,
  });

  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const fetchReviewQueue = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/mentor/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setTasks(data.tasks);
  };

  const submitReview = async (decision) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("feedback", reviewForm.feedback);
    formData.append("supportLink", reviewForm.supportLink);
    formData.append("decision", decision);

    if (reviewForm.supportFile) {
      formData.append("supportFile", reviewForm.supportFile);
    }

    const res = await fetch(
      `${BASE_URL}/mentor/task/${viewTask._id}/review`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (res.ok) {
      setViewTask(null);
      setReviewForm({ feedback: "", supportLink: "", supportFile: null });
      fetchReviewQueue();
    }
  };

  return (
    <div className="tasks-container">
      <div className="content-wrapper">
        <div className="tasks-header">
          <h1>Review Queue</h1>
        </div>

        <div className="table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Intern</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.internId?.name}</td>
                  <td>
                    <span className="badge status-submitted">{task.status}</span>
                  </td>
                  <td>{new Date(task.updatedAt).toLocaleString("en-GB")}</td>
                  <td>
                    <button className="action-btn btn-view" onClick={() => setViewTask(task)}>
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewTask && (
        <div className="modal-overlay">
          <div className="review-task-card">
            <div className="task-view-header">
              <div className="view-title-wrap">
                <FiEye className="view-main-icon" />
                <h2>Review Submission</h2>
              </div>
              <button className="close-view-btn" onClick={() => setViewTask(null)}>
                <FiX />
              </button>
            </div>

            <div className="task-view-body">
              {/* Task Details Row */}
              <div className="detail-card">
                <span>Task Title</span>
                <p>{viewTask.title}</p>
              </div>
              <div className="detail-card">
                <span>Intern Name</span>
                <p>{viewTask.internId?.name}</p>
              </div>

              <div className="detail-card full-width">
                <span>Task Description</span>
                <p>{viewTask.description}</p>
              </div>

              <div className="section-divider full-width">Submission Content</div>

              <div className="detail-card full-width">
                <span>Submission Link</span>
                {viewTask.submissionLink ? (
                  <a href={viewTask.submissionLink} target="_blank" rel="noreferrer" className="file-link">
                    Open Submitted Work
                  </a>
                ) : <p className="no-data">No link provided</p>}
              </div>

              <div className="detail-card full-width">
                <span>Intern's Notes</span>
                <p>{viewTask.submissionNotes || "No notes from intern"}</p>
              </div>

              {/* Review History (Injected correctly inside the scrollable body) */}
              {viewTask.reviewHistory?.length > 0 && (
                <>
                  <div className="section-divider full-width">Review History</div>
                  <div className="history-container full-width">
                    {viewTask.reviewHistory.map((review, index) => (
                      <div key={index} className="history-item">
                        <div className="history-header">
                          <span className={`badge status-${review.decision.toLowerCase().replace(/\s+/g, '-')}`}>
                            {review.decision}
                          </span>
                          <small><FiClock /> {new Date(review.reviewedAt).toLocaleDateString()}</small>
                        </div>
                        <p>{review.feedback}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="section-divider full-width">Your Action</div>

              <div className="detail-card full-width">
                <span>Feedback (Required)</span>
                <textarea
                  placeholder="Provide detailed feedback..."
                  rows="3"
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                />
              </div>

              <div className="detail-card">
                <span>Support Link</span>
                <input
                  type="text"
                  placeholder="https://resource.com"
                  value={reviewForm.supportLink}
                  onChange={(e) => setReviewForm({ ...reviewForm, supportLink: e.target.value })}
                />
              </div>

              <div className="detail-card">
                <span><FiPaperclip /> Support File</span>
                <input
                  type="file"
                  onChange={(e) => setReviewForm({ ...reviewForm, supportFile: e.target.files[0] })}
                />
              </div>

              {/* Action Buttons */}
              <div className="submit-btn-container full-width edit-btns">
                <button className="btn-create" onClick={() => submitReview("Approved")}>
                  <FiCheckCircle /> Approve
                </button>
                <button className="btn-create cancel-btn" onClick={() => submitReview("Changes Requested")}>
                  <FiRefreshCcw /> Request Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}