import { useEffect, useState } from "react";
import ProfileMentor from "../../components/profile/ProfileMentor";
import InternProfile from "../../components/profile/InternProfile";
import "../../style/ProfileView.css"; 

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Keep your existing date logic
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Keep your existing fetch logic
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.log(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="view-wrapper">
        <h2 className="view-title">Loading profile...</h2>
      </div>
    );
  }

  // CREATE OR EDIT MODE (Logic Unchanged)
  if (!profile || editMode) {
    const TargetComponent = role === "MENTOR" ? ProfileMentor : InternProfile;
    return (
      <TargetComponent 
        initialData={profile || {}} 
        isEdit={!!profile} 
        onSuccess={() => {
          fetchProfile();
          setEditMode(false);
        }} 
      />
    );
  }

  const userInitial = profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "?";

  // VIEW MODE
  return (
    <div className="view-wrapper">
      <div className="view-card">
        
        {/* Header Section */}
        <div className="profile-card-header">
          <button className="edit-btn-top" onClick={() => setEditMode(true)}>
            Edit 
          </button>
          <div className="avatar-circle">{userInitial}</div>
        </div>

        {/* User Intro */}
        <div className="user-intro">
          <h2 className="view-title">{profile.fullName}</h2>
          <span className="role-badge">
            {role === "MENTOR" ? "Official Mentor" : "Intern Student"}
          </span>
        </div>

        {/* Detailed Info List */}
        <div className="info-section">
          
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div className="info-text">
              <span className="info-label">Contact Number</span>
              <span className="info-value">{profile.phoneNumber}</span>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">👤</span>
            <div className="info-text">
              <span className="info-label">Gender</span>
              <span className="info-value">{profile.gender}</span>
            </div>
          </div>

          {role === "MENTOR" ? (
            <div className="info-item">
              <span className="info-icon">💡</span>
              <div className="info-text">
                <span className="info-label">Primary Expertise</span>
                <div>
                  <span className="expertise-badge">{profile.expertise}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="info-item">
                <span className="info-icon">🏫</span>
                <div className="info-text">
                  <span className="info-label">College Name</span>
                  <span className="info-value">{profile.collegeName}</span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🎓</span>
                <div className="info-text">
                  <span className="info-label">Degree & Semester</span>
                  <span className="info-value">{profile.degree} — {profile.yearOrSemester}</span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📅</span>
                <div className="info-text">
                  <span className="info-label">Internship Tenure</span>
                  <span className="info-value">
                    {formatDate(profile.internshipStartDate)} to {formatDate(profile.internshipEndDate)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;