// import { useState } from "react";

// function ProfileMentor() {
//   const [form, setForm] = useState({
//     fullName: "",
//     phoneNumber: "",
//     gender: "",
//     expertise: ""
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   console.log("Form Submitted!", form);

//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Please login first");
//     return;
//   }

//   try {
//    const res = await fetch("http://localhost:5000/profile/mentor", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`
//   },
//   body: JSON.stringify(form)
// });

//     const data = await res.json();
//     console.log("SERVER RESPONSE:", data);

//    if (!res.ok) {
//   // set validation errors if any
//   if (data.errors) {
//     setErrors(data.errors);
//   }

 
//   if (data.errors.profile === "Mentor profile already exists") {
  
//      alert("Profile already exists !! ");
//   } else if (!data.errors && data.message) {
//     setMessage(data.message);
//     setMessageType("error");
//   }

//   return;
// }

//     alert("Profile Created Successfully ✅");

//     setForm({
//       fullName: "",
//       phoneNumber: "",
//       gender: "",
//       expertise: ""
//     });

//     setErrors({});
//   } catch (err) {
//     console.log("Fetch Error:", err.message);
//     alert("Server error. Please try again.");
//   }
// };
//   return (
//     <div>
//       <h2>Mentor Profile</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="fullName"
//           placeholder="Full Name"
//           value={form.fullName}
//           onChange={handleChange}
//         />
//         <p>{errors?.fullName}</p>

//         <input
//           type="text"
//           name="phoneNumber"
//           placeholder="Phone Number"
//           value={form.phoneNumber}
//           onChange={handleChange}
//         />
//         <p>{errors?.phoneNumber}</p>

//         <select
//           name="gender"
//           value={form.gender}
//           onChange={handleChange}
//         >
//           <option value="">Select Gender</option>
//           <option>Male</option>
//           <option>Female</option>
//           <option>Other</option>
//         </select>
//         <p>{errors?.gender}</p>

//         <input
//           type="text"
//           name="expertise"
//           placeholder="Expertise"
//           value={form.expertise}
//           onChange={handleChange}
//         />
//         <p>{errors?.expertise}</p>

//         <button type="submit">Create Profile</button>
//       </form>
//     </div>
//   );
// }

// export default ProfileMentor;

import { useState } from "react";

function ProfileMentor({ initialData = null, isEdit = false, onSuccess }) {
  const [form, setForm] = useState({
    fullName: initialData?.fullName || "",
    phoneNumber: initialData?.phoneNumber || "",
    gender: initialData?.gender || "",
    expertise: initialData?.expertise || ""
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
          ? "http://localhost:3000/profile"
          : "http://localhost:3000/profile/mentor",
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

      if (!res.ok) {
        setErrors(data.errors || {});

        if (data.errors?.profile?.includes("already exists")) {
          alert("Mentor profile already exists !!");
        }

        return;
      }

      alert(
        isEdit
          ? "Mentor Profile Updated Successfully ✅"
          : "Mentor Profile Created Successfully ✅"
      );

      setErrors({});

      if (onSuccess) {
        onSuccess();
      }

      if (!isEdit) {
        setForm({
          fullName: "",
          phoneNumber: "",
          gender: "",
          expertise: ""
        });
      }
    } catch (err) {
      console.log(err.message);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>{isEdit ? "Edit Mentor Profile" : "Mentor Profile"}</h2>

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
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
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

        <button type="submit">
          {isEdit ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
}

export default ProfileMentor;