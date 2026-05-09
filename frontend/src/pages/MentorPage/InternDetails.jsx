
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mail,
  Phone,
  School,
  Calendar,
  Clock,
  GraduationCap,
  Layers,
  User,
  Link,
} from "lucide-react";
import "../../style/InternDetails.css";
const BASE_URL = import.meta.env.VITE_API_URL;


export default function InternDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intern, setIntern] = useState(null);

  useEffect(() => {
    fetchIntern();
  }, []);

  const fetchIntern = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/mentor/intern/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setIntern(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!intern) return <div className="loading">Loading...</div>;

  const profile = intern.profile;

  return (
    <div className="details-page">
      <div className="details-topbar">
        <h2>Intern Details</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
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
                    <p>{profile.phoneNumber || "N/A"}</p>
                  </div>
                </div>

                <div className="info-row">
                  <School size={18} className="info-icon" />
                  <div>
                    <label>College Name</label>
                    <p>{profile.collegeName || "N/A"}</p>
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
                  <p>{profile.fullName || "N/A"}</p>
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
                  <p>{profile.degree || "N/A"}</p>
                </div>
              </div>

              <div className="detail-item">
                <Layers size={20} className="detail-icon" />
                <div>
                  <label>Semester</label>
                  <p>{profile.yearOrSemester || "N/A"}</p>
                </div>
              </div>

              <div className="detail-item">
                <User size={20} className="detail-icon" />
                <div>
                  <label>Gender</label>
                  <p>{profile.gender || "N/A"}</p>
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={20} className="detail-icon" />
                <div>
                  <label>Date of Birth</label>
                  <p>{formatDate(profile.dateOfBirth)}</p>
                </div>
              </div>

              <div className="detail-item">
                <School size={20} className="detail-icon" />
                <div>
                  <label>College</label>
                  <p>{profile.collegeName || "N/A"}</p>
                </div>
              </div>

              <div className="detail-item">
                <Link size={20} className="detail-icon" />
                <div>
                  <label>GitHub</label>
                  <p>
                    {profile.githubUrl ? (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open GitHub
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>

              <div className="detail-item">
                <Link size={20} className="detail-icon" />
                <div>
                  <label>LinkedIn</label>
                  <p>
                    {profile.linkedinUrl ? (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open LinkedIn
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-profile">Profile not completed yet</div>
          )}
        </div>
      </div>
    </div>
  );
}