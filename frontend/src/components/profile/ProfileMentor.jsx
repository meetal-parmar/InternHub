import { useState } from "react";
import "../../style/InternProfile.css"; 
import toast from "react-hot-toast";

function MentorProfile({ initialData = {}, isEdit = false, onSuccess }) {
  const [form, setForm] = useState({
    fullName: initialData.fullName || "",
    phoneNumber: initialData.phoneNumber || "",
    gender: initialData.gender || "",
    expertise: initialData.expertise || ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  setErrors({});

  try {
    const endpoint = isEdit
      ? "http://localhost:3000/profile"
      : "http://localhost:3000/profile/mentor";

    const res = await fetch(endpoint, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) setErrors(data.errors);
      toast.error("Validation failed!");
      return;
    }

    toast.success(isEdit ? "Updated successfully " : "Created successfully ");

    if (onSuccess) onSuccess();
  } catch (err) {
    toast.error("Network Error");
  }
};

  return (
    <div className="form-wrapper">
      {/* Width ko yahan se control kiya gaya hai */}
      <div className="form-card" style={{ maxWidth: "420px", padding: "40px 30px" }}>
        <h2 className="form-title" style={{ textAlign: "center", marginBottom: "30px" }}>
          Mentor Profile
        </h2>

        {/* 'flexDirection: column' se ek line mein ek hi item aayega */}
        <form 
          onSubmit={handleSubmit} 
          style={{ display: "flex", flexDirection: "column", gap: "25px" }}
        >
          {/* Item 1 */}
          <div className="input-field" style={{ width: "100%" }}>
            <label>Full Name <span className="required-star">*</span></label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter full name" />
            {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
          </div>

          {/* Item 2 */}
          <div className="input-field" style={{ width: "100%" }}>
            <label>Phone Number <span className="required-star">*</span></label>
            <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="10 digit number" />
            {errors.phoneNumber && <span className="err-msg">{errors.phoneNumber}</span>}
          </div>

          {/* Item 3 */}
          <div className="input-field" style={{ width: "100%" }}>
            <label>Expertise <span className="required-star">*</span></label>
            <input type="text" name="expertise" value={form.expertise} onChange={handleChange} placeholder="e.g. React, Node.js" />
            {errors.expertise && <span className="err-msg">{errors.expertise}</span>}
          </div>

          {/* Item 4 */}
          <div className="input-field no-border" style={{ width: "100%" }}>
            <label>Gender <span className="required-star">*</span></label>
            <div className="radio-group" style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              <label className="radio-label">
                <input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} /> Male
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} /> Female
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Other" checked={form.gender === "Other"} onChange={handleChange} /> Other
              </label>
            </div>
            {errors.gender && <span className="err-msg">{errors.gender}</span>}
          </div>

          {/* Button */}
          <div className="btn-container" style={{ marginTop: "15px" }}>
            <button type="submit" className="save-btn" style={{ width: "100%", padding: "14px" }}>
              Save Mentor Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MentorProfile;