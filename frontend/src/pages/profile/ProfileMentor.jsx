import { useState } from "react";

function ProfileMentor() {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    expertise: ""
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
  console.log("Form Submitted!", form);

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
   const res = await fetch("http://localhost:5000/profile/mentor", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(form)
});

    const data = await res.json();
    console.log("SERVER RESPONSE:", data);

   if (!res.ok) {
  // set validation errors if any
  if (data.errors) {
    setErrors(data.errors);
  }

  // show message inline instead of alert
  if (data.errors.profile === "Mentor profile already exists") {
    // setMessage("Profile already exists");
    // setMessageType("info");
     alert("Profile already exists !! ");
  } else if (!data.errors && data.message) {
    setMessage(data.message);
    setMessageType("error");
  }

  return;
}

    alert("Profile Created Successfully ✅");

    setForm({
      fullName: "",
      phoneNumber: "",
      gender: "",
      expertise: ""
    });

    setErrors({});
  } catch (err) {
    console.log("Fetch Error:", err.message);
    alert("Server error. Please try again.");
  }
};
  return (
    <div>
      <h2>Mentor Profile</h2>

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

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <p>{errors?.gender}</p>

        <input
          type="text"
          name="expertise"
          placeholder="Expertise"
          value={form.expertise}
          onChange={handleChange}
        />
        <p>{errors?.expertise}</p>

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default ProfileMentor;