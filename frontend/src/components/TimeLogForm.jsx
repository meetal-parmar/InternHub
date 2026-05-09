// import React, { useState } from 'react';
// import TimePicker from './TimePicker';
// import toast from "react-hot-toast";

// const TimelogForm = ({ selectedDate, onLogAdded }) => {
//     const [startTime, setStartTime] = useState("09:00 AM");
//     const [endTime, setEndTime] = useState("10:00 AM");
//     const [category, setCategory] = useState("CODING");
//     const [description, setDescription] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         const payload = { 
//             workDate: selectedDate, 
//             startTime, 
//             endTime, 
//             category, 
//             description 
//         };

//         try {
//             const response = await fetch("http://localhost:3000/intern/timelog", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 credentials: "include",
//                 body: JSON.stringify(payload)
//             });

//             const result = await response.json();

//             if (response.ok) {
//                  toast.success("TimeLog added!", {
//                     position: "top-center",
//                     duration: 3000
//                 }); 
        
//                 onLogAdded(); 

//                 const nextStart = endTime; 

//                 const [time, modifier] = endTime.split(" ");
//                 let [hours, minutes] = time.split(":");
//                 let nextHours = parseInt(hours) + 1;
//                 let nextModifier = modifier;

//                 if (nextHours === 12) {
//                     nextModifier = modifier === "AM" ? "PM" : "AM";
//                 } else if (nextHours > 12) {
//                     nextHours = 1;
//                 }

//                 const formattedH = nextHours < 10 ? `0${nextHours}` : nextHours;
//                 const nextEnd = `${formattedH}:${minutes} ${nextModifier}`;

//                 setStartTime(nextStart);
//                 setEndTime(nextEnd);
//                 setDescription(""); 

//             } else {
//                     toast.error(result.message || "Failed to add log", {
//                     position: "top-center",
//                     duration: 3000
//                 });            }
//         } catch (error) {   
//             toast.error("Server error!", {
//                 position: "top-center"
//             });        }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="professional-form">
//             {/* Start Time */}
//             <div className="input-group">
//                 <label className="field-label">Start Time</label>
//                 <TimePicker value={startTime} onChange={setStartTime} />
//             </div>

//             {/* End Time */}
//             <div className="input-group">
//                 <label className="field-label">End Time</label>
//                 <TimePicker value={endTime} onChange={setEndTime} />
//             </div>

//             {/* Category */}
//             <div className="input-group">
//                 <label className="field-label">Category</label>
//                 <select 
//                     className="form-select" 
//                     value={category} 
//                     onChange={(e) => setCategory(e.target.value)}
//                 >
//                     <option value="CODING">CODING</option>
//                     <option value="LEARNING">LEARNING</option>
//                     <option value="MANAGEMENT">MANAGEMENT</option>
//                 </select>
//             </div>

//             {/* Description */}
//             <div className="input-group" style={{ flexGrow: 2 }}>
//                 <label className="field-label">Work Description</label>
//                 <input
//                     type="text"
//                     className="form-input"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="What did you work on?"
//                     required
//                 />
//             </div>

//             {/* Submit Button */}
//             <button type="submit" className="submit-btn">Add Log</button>
//         </form>
//     );
// };

//  export default TimelogForm;


import React, { useState, useEffect } from 'react';
import TimePicker from './TimePicker';
import toast from "react-hot-toast";

// --- editData aur onCancelEdit props add kiye ---
const TimelogForm = ({ selectedDate, onLogAdded, editData, onCancelEdit }) => {
    const [startTime, setStartTime] = useState("09:00 AM");
    const [endTime, setEndTime] = useState("10:00 AM");
    const [category, setCategory] = useState("CODING");
    const [description, setDescription] = useState("");

    // --- 1. useEffect: Jab Edit button click ho, Form bhar jaye ---
    useEffect(() => {
        if (editData) {
            setStartTime(editData.startTime);
            setEndTime(editData.endTime);
            setCategory(editData.category);
            setDescription(editData.description);
        } else {
            // Reset to default for new entries
            setDescription("");
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = { 
            workDate: selectedDate, 
            startTime, 
            endTime, 
            category, 
            description 
        };
        const BASE_URL = import.meta.env.VITE_API_URL;
        // --- 2. Dynamic URL aur Method (POST vs PUT) ---
        const isEditing = !!editData;
        const url = isEditing 
            ? `${BASE_URL}/intern/timelog/${editData._id}` 
            : `${BASE_URL}/intern/timelog`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(isEditing ? "Log updated!" : "TimeLog added!", {
                    position: "top-center",
                    duration: 3000
                }); 
        
                onLogAdded(); // Refresh Table
                
                if (isEditing) {
                    onCancelEdit(); // Edit mode se bahar nikalein
                } else {
                    // Sirf Add ke waqt next slot auto-calculate karein
                    const [time, modifier] = endTime.split(" ");
                    let [hours, minutes] = time.split(":");
                    let nextHours = parseInt(hours) + 1;
                    let nextModifier = modifier;

                    if (nextHours === 12) {
                        nextModifier = modifier === "AM" ? "PM" : "AM";
                    } else if (nextHours > 12) {
                        nextHours = 1;
                    }

                    const formattedH = nextHours < 10 ? `0${nextHours}` : nextHours;
                    const nextEnd = `${formattedH}:${minutes} ${nextModifier}`;

                    setStartTime(endTime);
                    setEndTime(nextEnd);
                    setDescription(""); 
                }

            } else {
                toast.error(result.message || "Operation failed", { position: "top-center" });
            }
        } catch (error) { 
            toast.error("Server error!", { position: "top-center" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="professional-form">
            <div className="input-group">
                <label className="field-label">Start Time</label>
                <TimePicker value={startTime} onChange={setStartTime} />
            </div>

            <div className="input-group">
                <label className="field-label">End Time</label>
                <TimePicker value={endTime} onChange={setEndTime} />
            </div>

            <div className="input-group">
                <label className="field-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="CODING">CODING</option>
                    <option value="LEARNING">LEARNING</option>
                    <option value="MANAGEMENT">MANAGEMENT</option>
                </select>
            </div>

            <div className="input-group" style={{ flexGrow: 2 }}>
                <label className="field-label">Work Description</label>
                <input
                    type="text"
                    className="form-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you work on?"
                    required
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="submit-btn">
                    {editData ? "Update Log" : "Add Log"}
                </button>
                {editData && (
                    <button 
                        type="button" 
                        onClick={onCancelEdit} 
                        style={{ height: '45px', padding: '0 15px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TimelogForm;
