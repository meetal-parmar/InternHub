

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaUsers,
  FaPaperclip,
  FaLink,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../../style/MentorMaterials.css";

export default function MentorMaterials() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [hoveredInternsId, setHoveredInternsId] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch("http://localhost:3000/mentor/materials", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setMaterials(data.materials || []);
    } catch (error) {
      console.error("Error fetching materials", error);
    }
  };

  const handleDeleteMaterial = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/mentor/materials/${selectedMaterial._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Material deleted successfully 🗑️");
        setShowDeleteConfirm(false);
        setSelectedMaterial(null);
        fetchMaterials();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="materials-page">
      <div className="materials-header">
        <h1>📚 Materials</h1>
        <button
          className="add-material-btn"
          onClick={() => navigate("/mentor/materials/add")}
        >
          <FaPlus /> Add Material
        </button>
      </div>

      <div className="materials-grid">
        {materials.map((item) => (
          <div key={item._id} className="material-card">
            <div className="card-top-icon">
              <FaBookOpen />
            </div>

            <div className="card-content">
              <h3>{item.title}</h3>

              <div className="card-stats">
                <div
                  className="stat-row intern-trigger"
                  onMouseEnter={() => setHoveredInternsId(item._id)}
                  onMouseLeave={() => setHoveredInternsId(null)}
                >
                  <p className="stat-text">
                    <FaUsers className="stat-icon" />{" "}
                    {item.assignedInterns.length} interns
                  </p>

                  {hoveredInternsId === item._id && (
                    <div className="intern-tooltip">
                      <div className="tooltip-header">Assigned Interns</div>
                      <div className="tooltip-list">
                        {item.assignedInterns.map((intern) => (
                          <span key={intern._id} className="intern-tag">
                            {intern.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <p className="stat-text">
                  <FaPaperclip className="stat-icon" /> {item.files.length} files
                </p>
                <p className="stat-text">
                  <FaLink className="stat-icon" /> {item.links.length} links
                </p>
              </div>
            </div>

            <div className="card-footer">
              <span className="date-text">
                📅 {formatDateTime(item.createdAt)}
              </span>
              <button
                className="view-btn"
                onClick={() => setSelectedMaterial(item)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {selectedMaterial && (
        <div
          className="material-modal-overlay"
          onClick={() => setSelectedMaterial(null)}
        >
          <div
            className="material-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="material-modal-header">
              <div className="material-modal-title-wrap">
                <span className="material-modal-icon">📚</span>
                <div>
                  <h2>{selectedMaterial.title}</h2>
                  <p>
                    {selectedMaterial.description ||
                      "No description added"}
                  </p>
                </div>
              </div>

              <button
                className="close-material-modal"
                onClick={() => setSelectedMaterial(null)}
              >
                ✕
              </button>
            </div>

            <div className="material-modal-section">
              <h4>👥 Assigned Interns</h4>
              <div className="material-horizontal-list">
                {selectedMaterial.assignedInterns.map((intern) => (
                  <div key={intern._id} className="mini-card-chip">
                    👤 {intern.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="material-modal-section">
              <h4>📎 Files</h4>
              <div className="material-grid-cards">
                {selectedMaterial.files.length > 0 ? (
                  selectedMaterial.files.map((file, index) => (
                    <div key={index} className="small-info-card">
                      <span>📄</span>
                      <p>{file.fileName}</p>
                    </div>
                  ))
                ) : (
                  <p>No files</p>
                )}
              </div>
            </div>

            <div className="material-modal-section">
              <h4>🔗 Links</h4>
              <div className="material-grid-cards">
                {selectedMaterial.links.length > 0 ? (
                  selectedMaterial.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="small-info-card link-card"
                    >
                      <span>🌐</span>
                      <p>{link.label}</p>
                    </a>
                  ))
                ) : (
                  <p>No links</p>
                )}
              </div>
            </div>

            <div className="material-modal-footer">
              <span>🕒 {formatDateTime(selectedMaterial.createdAt)}</span>
              <button
  className="delete-icon-btn"
  onClick={() => setShowDeleteConfirm(true)}
  title="Delete Material"
>
  <FaTrash />
</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div
          className="material-delete-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="material-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
           <div className="delete-icon-circle">
  <FaTrash />
</div>
            <h3>Delete Material?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedMaterial?.title}</strong>?
            </p>

            <div className="delete-modal-actions">
              <button
                className="cancel-delete-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={handleDeleteMaterial}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}