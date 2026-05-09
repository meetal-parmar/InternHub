import { useEffect, useState } from "react";
import { 
  FaBookOpen, FaPaperclip, FaLink, FaCalendarAlt, FaCheckCircle, FaTimes 
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../../style/InternMaterial.css";

export default function InternMaterials() {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);
const BASE_URL = import.meta.env.VITE_API_URL;
  const fetchMaterials = async () => {
    //  const BASE_URL = import.meta.env.VITE_API_URL;
    try {
      const res = await fetch(`${BASE_URL}/materials/intern`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMaterials(data.data);
      }
    } catch (error) {
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/materials/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedMaterial(data.data);
        setShowModal(true);
      }
    } catch (error) {
      toast.error("Could not load details");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/materials/read/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Progress updated! ");
        setMaterials((prev) =>
          prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
        );
        setShowModal(false);
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const totalTopics = materials.length;
  const completedTopics = materials.filter((m) => m.isRead).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) return <div className="loading-state">Loading your journey...</div>;

  return (
    <div className="intern-materials-page">
      {/* HEADER SECTION */}
      <header className="journey-header">
        <div className="header-text">
          <h1>My Learning Journey</h1>
          <p className="progress-stats">
            {progressPercent}% Completed ({completedTopics} / {totalTopics} topics)
          </p>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </header>

      {/* GRID SECTION */}
      <div className="materials-grid">
        {materials.map((item) => (
          <div key={item._id} className={`intern-material-card ${item.isRead ? "completed" : ""}`}>
            <span className={`status-badge ${item.isRead ? "badge-green" : "badge-blue"}`}>
              {item.isRead ? "COMPLETED" : "NEW"}
            </span>

            <div className="card-icon"><FaBookOpen /></div>
            
            <h3>{item.title}</h3>
            <p className="card-desc">{item.description}</p>

            <div className="card-meta">
              <span><FaPaperclip /> {item.fileCount} Files</span>
              <span><FaLink /> {item.linkCount} Links</span>
            </div>

            <div className="card-footer">
              <span className="date"><FaCalendarAlt /> {formatDateTime(item.createdAt)}</span>
              <button className="view-detail-btn" onClick={() => openDetails(item._id)}>
                View Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && selectedMaterial && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>

            <div className="modal-header">
              <div className="modal-title-row">
                <div className="modal-icon-bg"><FaBookOpen /></div>
                <div className="title-text-group">
                  <h2 className="modal-main-title">{selectedMaterial.title}</h2>
                  <p className="modal-subtitle">{selectedMaterial.description}</p>
                </div>
              </div>
            </div>

            <div className="modal-sections">
              {/* Files Section with React Icons */}
{selectedMaterial.files?.length > 0 && (
  <section className="modal-res-section">
    <h4><FaPaperclip /> Files</h4>
    <div className="resource-list">
      {selectedMaterial.files.map((fileObj, i) => {
        // Backend se 'filePath' aa raha hai, 'url' nahi
        const path = fileObj.filePath || fileObj.url; 
        
        if (!path) return null;

        // URL prepare karein
        const fileUrl = path.startsWith('http') 
          ? path 
          : `${BASE_URL}/${path.replace(/\\/g, '/')}`; // Windows paths fix karne ke liye

        return (
          <a 
            key={i} 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="resource-item"
          >
            <FaPaperclip className="res-icon" />
            <span className="res-name">{fileObj.fileName || `Attachment ${i + 1}`}</span>
          </a>
        );
      })}
    </div>
  </section>
)}

  {/* Links Section - EXACT PREVIOUS DESIGN */}
  {selectedMaterial.links?.length > 0 && (
    <section className="modal-res-section">
      <h4><FaLink /> Links</h4>
      <div className="resource-list links-grid">
        {selectedMaterial.links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noreferrer" className="resource-item">
            <FaLink className="res-icon" />
            <span className="res-name">{l.label}</span>
          </a>
        ))}
      </div>
    </section>
  )}
            </div>

            <div className="modal-footer">
              <span className="footer-date">
                <FaCalendarAlt /> {formatDateTime(selectedMaterial.createdAt)}
              </span>
              
              {!selectedMaterial.isRead ? (
                <button 
                  className="mark-read-btn" 
                  onClick={() => handleMarkAsRead(selectedMaterial._id)}
                >
                  <FaCheckCircle /> Mark as Read
                </button>
              ) : (
                <div className="completed-status">
                   <FaCheckCircle className="check-success" />
                   <span className="completed-text">Topic Progress: 100% Read</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}