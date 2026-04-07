
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Phone, School, Calendar, Clock, GraduationCap, Layers, User } from "lucide-react"; // Icons add kiye
import "../../style/InternDetails.css";

export default function InternDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intern, setIntern] = useState(null);

  useEffect(() => {
    fetchIntern();
  }, []);

  const fetchIntern = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/mentor/intern/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setIntern(data);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  if (!intern) return <div className="loading">Loading...</div>;

  const profile = intern.profile;

  return (
    <div className="details-page">
      <div className="details-topbar">
        <h2>Intern Details</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="details-layout">
        {/* LEFT PROFILE CARD */}
        <div className="profile-card">
          <div className="avatar-circle">
            {intern.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="profile-name">{intern.name}</h3>
          
          <hr className="divider" />

          <div className="profile-info-list">
            <div className="info-row">
              <Mail size={18} className="info-icon" />
              <div>
                <label>E-Mail</label>
                <p>{intern.email}</p>
              </div>
            </div>

            {profile && (
              <>
                <div className="info-row">
                  <Phone size={18} className="info-icon" />
                  <div>
                    <label>Phone Number</label>
                    <p>{profile.phoneNumber}</p>
                  </div>
                </div>
                <div className="info-row">
                  <School size={18} className="info-icon" />
                  <div>
                    <label>College Name</label>
                    <p>{profile.collegeName}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT INFO CARD */}
        <div className="info-card">
          <div className="card-tabs">
            <span className="tab active">Internship Details</span>
          </div>

          {profile ? (
            <div className="details-grid">
              <div className="detail-item">
                <Calendar size={20} className="detail-icon" />
                <div>
                  <label>Joining Date</label>
                  <p>{formatDate(profile.internshipStartDate)}</p>
                </div>
              </div>

              <div className="detail-item">
                <User size={20} className="detail-icon" />
                <div>
                  <label>Full Name</label>
                  <p>{profile.fullName}</p>
                </div>
              </div>

              <div className="detail-item">
                <Clock size={20} className="detail-icon" />
                <div>
                  <label>End Date</label>
                  <p>{formatDate(profile.internshipEndDate)}</p>
                </div>
              </div>

              <div className="detail-item">
                <GraduationCap size={20} className="detail-icon" />
                <div>
                  <label>Degree</label>
                  <p>{profile.degree}</p>
                </div>
              </div>

              <div className="detail-item">
                <Layers size={20} className="detail-icon" />
                <div>
                  <label>Semester</label>
                  <p>{profile.yearOrSemester}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-profile">Profile not completed yet</p>
          )}
        </div>
      </div>
    </div>
  );
}