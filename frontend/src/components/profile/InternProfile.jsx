


// import { useState } from "react";
// import "../../style/InternProfile.css";
// // 1. Sirf toast import karein
// import toast from "react-hot-toast";

// function InternProfile({ initialData = {}, isEdit = false, onSuccess }) {
//   const [form, setForm] = useState({
//     fullName: initialData.fullName || "",
//     phoneNumber: initialData.phoneNumber || "",
//     dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split("T")[0] : "",
//     gender: initialData.gender || "",
//     collegeName: initialData.collegeName || "",
//     degree: initialData.degree || "",
//     yearOrSemester: initialData.yearOrSemester || "",
//     internshipStartDate: initialData.internshipStartDate ? initialData.internshipStartDate.split("T")[0] : "",
//     internshipEndDate: initialData.internshipEndDate ? initialData.internshipEndDate.split("T")[0] : "",
//     githubUrl: initialData.githubUrl || "",
//     linkedinUrl: initialData.linkedinUrl || ""
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     setErrors({}); 

//     try {
//       const res = await fetch(isEdit ? "http://localhost:3000/profile" : "http://localhost:3000/profile/intern", {
//         method: isEdit ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form)
//       });
      
//       const data = await res.json();

//       if (!res.ok) {
//         if (data.errors) {
//           setErrors(data.errors);
//           // Error Toast
//           toast.error("Validations failed! Please check red marks.");
//         } else {
//           toast.error(data.msg || "Failed to save profile");
//         }
//         return;
//       }

//       // 2. Success Toast (Alert replace ho gaya)
//       toast.success(isEdit ? "Profile Updated Successfully! ✅" : "Profile Created Successfully! ✅", {
//         duration: 3000,
//       });

//       if (onSuccess) onSuccess();
//     } catch (err) {
//       toast.error("Network Error: Backend not reachable");
//     }
//   };

//   return (
//     <div className="form-wrapper">
//       <div className="form-card">
//         <h2 className="form-title">Profile</h2>
        
//         <form className="grid-form" onSubmit={handleSubmit}>
//           {/* Row 1: Basic Info */}
//           <div className="input-field">
//             <label>Full Name <span className="required-star">*</span></label>
//             <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="first name" />
//             {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
//           </div>

//           <div className="input-field">
//             <label>Phone Number <span className="required-star">*</span></label>
//             <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="enter phone number" />
//             {errors.phoneNumber && <span className="err-msg">{errors.phoneNumber}</span>}
//           </div>

//           {/* Row 2: Personal Details */}
//           <div className="input-field">
//             <label>Date of Birth <span className="required-star">*</span></label>
//             <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
//             {errors.dateOfBirth && <span className="err-msg">{errors.dateOfBirth}</span>}
//           </div>

//           <div className="input-field no-border">
//             <label>Gender <span className="required-star">*</span></label>
//             <div className="radio-group">
//               <label className="radio-label">
//                 <input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} /> Male
//               </label>
//               <label className="radio-label">
//                 <input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} /> Female
//               </label>
//             </div>
//             {errors.gender && <span className="err-msg">{errors.gender}</span>}
//           </div>

//           {/* Row 3: College */}
//           <div className="input-field full-width-input">
//             <label>College Name <span className="required-star">*</span></label>
//             <input type="text" name="collegeName" value={form.collegeName} onChange={handleChange} placeholder="enter college name" />
//             {errors.collegeName && <span className="err-msg">{errors.collegeName}</span>}
//           </div>

//           {/* Row 4: Academics */}
//           <div className="input-field">
//             <label>Degree <span className="required-star">*</span></label>
//             <input type="text" name="degree" value={form.degree} onChange={handleChange} placeholder="e.g. BSCIT" />
//             {errors.degree && <span className="err-msg">{errors.degree}</span>}
//           </div>

//           <div className="input-field">
//             <label>Semester/Year <span className="required-star">*</span></label>
//             <input type="text" name="yearOrSemester" value={form.yearOrSemester} onChange={handleChange} placeholder="e.g. 6th" />
//             {errors.yearOrSemester && <span className="err-msg">{errors.yearOrSemester}</span>}
//           </div>

//           {/* Row 5: Timeline */}
//           <div className="input-field">
//             <label>Internship Start Date <span className="required-star">*</span></label>
//             <input type="date" name="internshipStartDate" value={form.internshipStartDate} onChange={handleChange} />
//             {errors.internshipStartDate && <span className="err-msg">{errors.internshipStartDate}</span>}
//           </div>

//           <div className="input-field">
//             <label>Internship End Date <span className="required-star">*</span></label>
//             <input type="date" name="internshipEndDate" value={form.internshipEndDate} onChange={handleChange} />
//             {/* Displaying backend validation for end date */}
//             {errors.internshipEndDate && <span className="err-msg">{errors.internshipEndDate}</span>}
//           </div>

//           {/* Row 6: Socials */}
//           <div className="input-field">
//             <label>GitHub URL</label>
//             <input type="text" name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="github link" />
//           </div>

//           <div className="input-field">
//             <label>LinkedIn URL</label>
//             <input type="text" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="linkedin link" />
//           </div>

//           <div className="btn-container">
//             <button type="submit" className="save-btn">Save Profile</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
// export default InternProfile; 



import { useState, useEffect } from "react";
import "../../style/InternProfile.css";
import toast from "react-hot-toast";

function InternProfile({ initialData = {}, isEdit = false, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    collegeName: "",
    degree: "",
    yearOrSemester: "",
    internshipStartDate: "",
    internshipEndDate: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ IMPORTANT FIX → auto fill data when initialData comes from API
  useEffect(() => {
    setForm({
      fullName: initialData.fullName || "",
      phoneNumber: initialData.phoneNumber || "",
      dateOfBirth: initialData.dateOfBirth
        ? initialData.dateOfBirth.split("T")[0]
        : "",
      gender: initialData.gender || "",
      collegeName: initialData.collegeName || "",
      degree: initialData.degree || "",
      yearOrSemester: initialData.yearOrSemester || "",
      internshipStartDate: initialData.internshipStartDate
        ? initialData.internshipStartDate.split("T")[0]
        : "",
      internshipEndDate: initialData.internshipEndDate
        ? initialData.internshipEndDate.split("T")[0]
        : "",
      githubUrl: initialData.githubUrl || "",
      linkedinUrl: initialData.linkedinUrl || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setErrors({});

    try {
      const res = await fetch(
        isEdit
          ? "http://localhost:3000/profile"
          : "http://localhost:3000/profile/intern",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          toast.error("Please fix validation errors");
        } else {
          toast.error(data.msg || "Failed to save profile");
        }
        return;
      }

      toast.success(
        isEdit
          ? "Profile updated successfully ✅"
          : "Profile created successfully ✅"
      );

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Network Error: Backend not reachable");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">
          {isEdit ? "Update Profile" : "Create Profile"}
        </h2>

        <form className="grid-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label>
              Full Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <span className="err-msg">{errors.fullName}</span>
            )}
          </div>

          <div className="input-field">
            <label>
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <span className="err-msg">{errors.phoneNumber}</span>
            )}
          </div>

          <div className="input-field">
            <label>
              Date of Birth <span className="required-star">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <span className="err-msg">{errors.dateOfBirth}</span>
            )}
          </div>

          <div className="input-field">
            <label>
              Gender <span className="required-star">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                />
                Male
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={form.gender === "Other"}
                  onChange={handleChange}
                />
                Other
              </label>
            </div>
            {errors.gender && (
              <span className="err-msg">{errors.gender}</span>
            )}
          </div>

          <div className="input-field full-width-input">
            <label>
              College Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="collegeName"
              value={form.collegeName}
              onChange={handleChange}
              placeholder="Enter college name"
            />
            {errors.collegeName && (
              <span className="err-msg">{errors.collegeName}</span>
            )}
          </div>

          <div className="input-field">
            <label>
              Degree <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="e.g. BSc IT"
            />
            {errors.degree && (
              <span className="err-msg">{errors.degree}</span>
            )}
          </div>

          <div className="input-field">
            <label>
              Semester/Year <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="yearOrSemester"
              value={form.yearOrSemester}
              onChange={handleChange}
              placeholder="e.g. 5th"
            />
            {errors.yearOrSemester && (
              <span className="err-msg">{errors.yearOrSemester}</span>
            )}
          </div>

          <div className="input-field">
            <label>
              Internship Start Date <span className="required-star">*</span>
            </label>
            <input
              type="date"
              name="internshipStartDate"
              value={form.internshipStartDate}
              onChange={handleChange}
            />
            {errors.internshipStartDate && (
              <span className="err-msg">{errors.internshipStartDate}</span>
            )}
          </div>

          <div className="input-field">
            <label>
              Internship End Date <span className="required-star">*</span>
            </label>
            <input
              type="date"
              name="internshipEndDate"
              value={form.internshipEndDate}
              onChange={handleChange}
            />
            {errors.internshipEndDate && (
              <span className="err-msg">{errors.internshipEndDate}</span>
            )}
          </div>

          <div className="input-field">
            <label>GitHub URL</label>
            <input
              type="text"
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
              placeholder="GitHub profile URL"
            />
          </div>

          <div className="input-field">
            <label>LinkedIn URL</label>
            <input
              type="text"
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={handleChange}
              placeholder="LinkedIn profile URL"
            />
          </div>

          <div className="btn-container">
            <button type="submit" className="save-btn">
              {isEdit ? "Update Profile" : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InternProfile;