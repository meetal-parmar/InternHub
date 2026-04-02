import { useState } from "react";

function InternProfile({ initialData = {}, isEdit = false, onSuccess }) {
  const [form, setForm] = useState({
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
    : ""
});

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(
  isEdit
    ? "http://localhost:5000/profile"
    : "http://localhost:5000/profile/intern",
  {
    method: isEdit ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(form)
  }
);
      const data = await res.json();
      console.log("SERVER RESPONSE:", data);

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }

        if (data.errors?.profile?.includes("already exists")) {
          alert("Intern profile already exists !!");
        }

        return;
      }

     alert(isEdit ? "Profile Updated ✅" : "Intern Profile Created Successfully ✅");
     if (onSuccess) {
  onSuccess();
}

      setForm({
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        collegeName: "",
        degree: "",
        yearOrSemester: "",
        internshipStartDate: "",
        internshipEndDate: ""
      });

      setErrors({});
    } catch (err) {
      console.log("Fetch Error:", err.message);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div>
      <h2>Intern Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />
        <p>{errors?.fullName}</p>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        <p>{errors?.phoneNumber}</p>

        DOB: <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
        />
        <p>{errors?.dateOfBirth}</p>

       <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <p>{errors?.gender}</p>

        <input
          type="text"
          name="collegeName"
          placeholder="College Name"
          value={form.collegeName}
          onChange={handleChange}
        />
        <p>{errors?.collegeName}</p>

        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={form.degree}
          onChange={handleChange}
        />
        <p>{errors?.degree}</p>

        <input
          type="text"
          name="yearOrSemester"
          placeholder="Year / Semester"
          value={form.yearOrSemester}
          onChange={handleChange}
        />
        <p>{errors?.yearOrSemester}</p>

        Internship Start Date:  <input
          type="date"
          name="internshipStartDate"
          value={form.internshipStartDate}
          onChange={handleChange}
        />
        <p>{errors?.internshipStartDate}</p>

        Internship End Date:  <input
          type="date"
          name="internshipEndDate"
          value={form.internshipEndDate}
          onChange={handleChange}
        />
        <p>{errors?.internshipEndDate}</p>

        <button type="submit">
  {isEdit ? "Update Profile" : "Create Intern Profile"}
</button>
      </form>
    </div>
  );
}

export default InternProfile;