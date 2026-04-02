import { useEffect, useState } from "react";
import ProfileMentor from "../../components/profile/ProfileMentor";
import InternProfile from "../../components/profile/InternProfile";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
    return <h2>Loading profile...</h2>;
  }

  // CREATE MODE
  if (!profile) {
    return (
      <div>
        <h2>Create Your Profile</h2>
        {role === "MENTOR" ? (
          <ProfileMentor onSuccess={fetchProfile} />
        ) : (
          <InternProfile onSuccess={fetchProfile} />
        )}
      </div>
    );
  }

  // EDIT MODE
  if (editMode) {
    return (
      <div>
        {role === "MENTOR" ? (
          <ProfileMentor
            initialData={profile}
            isEdit={true}
            onSuccess={() => {
              fetchProfile();
              setEditMode(false);
            }}
          />
        ) : (
          <InternProfile
            initialData={profile}
            isEdit={true}
            onSuccess={() => {
              fetchProfile();
              setEditMode(false);
            }}
          />
        )}
      </div>
    );
  }

  // VIEW MODE
  return (
    <div>
      <h2>Your Profile</h2>

      <button onClick={() => setEditMode(true)}>
        ✏️ Edit
      </button>

      <div>
        <p><strong>Name:</strong> {profile.fullName}</p>
        <p><strong>Phone:</strong> {profile.phoneNumber}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>

        {role === "MENTOR" ? (
          <p><strong>Expertise:</strong> {profile.expertise}</p>
        ) : (
          <>
            <p><strong>Date of Birth:</strong> {formatDate(profile.dateOfBirth)}</p>
            <p><strong>College:</strong> {profile.collegeName}</p>
            <p><strong>Degree:</strong> {profile.degree}</p>
            <p><strong>Semester:</strong> {profile.yearOrSemester}</p>
            <p><strong>Internship Start:</strong> {formatDate(profile.internshipStartDate)}</p>
            <p><strong>Internship End:</strong> {formatDate(profile.internshipEndDate)}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;