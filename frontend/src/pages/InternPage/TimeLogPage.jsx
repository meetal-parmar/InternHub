// import React, { useState, useEffect } from 'react';
// import '../../style/Timelog.css';
// import TimelogForm from '../../components/TimeLogForm';
// import TimelogTable from '../../components/TimelogTable';

// const TimelogPage = () => {
//     const [logs, setLogs] = useState([]);
//     const [selectedDate, setSelectedDate] = useState("2026-04-06");
//     const [dayTotal, setDayTotal] = useState("0.00");

//     // Logs fetch karne ka function
//     const fetchAllLogs = async () => {
//         try {
//             const response = await fetch(`http://localhost:3000/intern/timelog?date=${selectedDate}`, {
//                 credentials: 'include'
//             });
//             const result = await response.json();
//             if (response.ok) {
//                 setLogs(result.data);
//                 setDayTotal(result.totalHours);
//             }
//         } catch (error) {
//             console.error("Fetch error:", error);
//         }
//     };

//     // Date change hone par ya page load hone par fetch karein
//     useEffect(() => {
//         fetchAllLogs();
//     }, [selectedDate]);

//     return (
//         <div className="timelog-page-container">
//             <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//                 <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
//                     <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
//                         TIMELOG : <span style={{ color: '#2563eb' }}>{dayTotal} HOURS</span>
//                     </h1>
                    
//                     <div className="custom-datepicker-container">
//     <div className="datepicker-display">
//         <span className="date-text">
//             {new Date(selectedDate).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric'
//             }).replace(/\//g, ' - ')}
//         </span>
//         <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//             <line x1="16" y1="2" x2="16" y2="6"></line>
//             <line x1="8" y1="2" x2="8" y2="6"></line>
//             <line x1="3" y1="10" x2="21" y2="10"></line>
//         </svg>
//     </div>
//     <input 
//         type="date" 
//         className="hidden-native-datepicker" 
//         value={selectedDate} 
//         onChange={(e) => setSelectedDate(e.target.value)} 
//     />
// </div>
//                 </header>

//                 {/* ✅ Yahan Aapka Purana TimelogForm Component Hai (Design intact rahega) */}
//                 <TimelogForm 
//                     selectedDate={selectedDate} 
//                     onLogAdded={fetchAllLogs} 
//                 />

//                 <div className="table-card" style={{ marginTop: '2rem' }}>
//                     {/* ✅ Yahan Aapka Purana TimelogTable Component Hai */}
//                     <TimelogTable 
//                         logs={logs} 
//                         setLogs={setLogs} 
//                         setDayTotal={setDayTotal}
//                         selectedDate={selectedDate}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TimelogPage;



// import React, { useState, useEffect, useCallback } from 'react';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import '../../style/Timelog.css';

// import TimelogForm from '../../components/TimeLogForm';
// import TimelogTable from '../../components/TimelogTable';

// const TimelogPage = () => {
//     const [logs, setLogs] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [dayTotal, setDayTotal] = useState("0.00");

//     const getFormattedDate = (date) => date.toISOString().split('T')[0];

//     const fetchAllLogs = useCallback(async () => {
//         const dateStr = getFormattedDate(selectedDate);
//         try {
//             const response = await fetch(`http://localhost:3000/intern/timelog?date=${dateStr}`, {
//                 credentials: 'include'
//             });
//             const result = await response.json();
//             if (response.ok) {
//                 setLogs(result.data || []);
//                 setDayTotal(result.totalHours || "0.00");
//             }
//         } catch (error) {
//             console.error("Fetch error:", error);
//         }
//     }, [selectedDate]);

//     useEffect(() => { fetchAllLogs(); }, [fetchAllLogs]);

//     return (
//         <div className="timelog-page-container">
//             <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//                 <header className="page-header-flex">
//                     {/* Size choti aur attractive header */}
//                     <h1 className="timelog-title">
//                         TIMELOG : <span className="blue-hours">{dayTotal} HOURS</span>
//                     </h1>
                    
//                     {/* Datepicker on the right with old icon */}
//                     <div className="datepicker-right-wrapper">
//                         <div className="icon-input-container">
//                             <svg className="calendar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                                 <line x1="16" y1="2" x2="16" y2="6"></line>
//                                 <line x1="8" y1="2" x2="8" y2="6"></line>
//                                 <line x1="3" y1="10" x2="21" y2="10"></line>
//                             </svg>
//                             <DatePicker
//                                 selected={selectedDate}
//                                 onChange={(date) => setSelectedDate(date)}
//                                 dateFormat="dd - MM - yyyy"
//                                 className="datepicker-custom-input"
//                                 calendarClassName="premium-calendar"
//                                 todayButton="Today"
//                                 popperPlacement="bottom-end"
//                             />
//                         </div>
//                     </div>
//                 </header>

//                 {/* Aapka purana Form aur Table yahan safe hai */}
//                 <TimelogForm 
//                     selectedDate={getFormattedDate(selectedDate)} 
//                     onLogAdded={fetchAllLogs} 
//                 />

//                 <div className="table-card" style={{ marginTop: '2rem' }}>
//                     <TimelogTable 
//                         logs={logs} 
//                         setLogs={setLogs} 
//                         setDayTotal={setDayTotal}
//                         selectedDate={getFormattedDate(selectedDate)}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TimelogPage;
// import React, { useState, useEffect, useCallback } from 'react';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import '../../style/Timelog.css';

// import TimelogForm from '../../components/TimeLogForm';
// import TimelogTable from '../../components/TimelogTable';

// const TimelogPage = () => {
//     const [logs, setLogs] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [dayTotal, setDayTotal] = useState("0.00");
    
//     // --- 1. Edit State Add Kari ---
//     const [editingLog, setEditingLog] = useState(null);

//     const getFormattedDate = (date) => date.toISOString().split('T')[0];

//     const fetchAllLogs = useCallback(async () => {
//         const dateStr = getFormattedDate(selectedDate);
//         try {
//             const response = await fetch(`http://localhost:3000/intern/timelog?date=${dateStr}`, {
//                 credentials: 'include'
//             });
//             const result = await response.json();
//             if (response.ok) {
//                 setLogs(result.data || []);
//                 setDayTotal(result.totalHours || "0.00");
//             }
//         } catch (error) {
//             console.error("Fetch error:", error);
//         }
//     }, [selectedDate]);

//     useEffect(() => { fetchAllLogs(); }, [fetchAllLogs]);

//     // --- 2. Edit Click Hone Par Function (Table call karega) ---
//     const handleEditClick = (log) => {
//         setEditingLog(log);
//         window.scrollTo({ top: 0, behavior: 'smooth' }); // Form upar hai toh scroll karein
//     };

//     // --- 3. Cancel Edit Function ---
//     const handleCancelEdit = () => {
//         setEditingLog(null);
//     };

//     return (
//         <div className="timelog-page-container">
//             <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//                 <header className="page-header-flex">
//                     <h1 className="timelog-title">
//                         TIMELOG : <span className="blue-hours">{dayTotal} HOURS</span>
//                     </h1>
                    
//                     <div className="datepicker-right-wrapper">
//                         <div className="icon-input-container">
//                             <svg className="calendar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                                 <line x1="16" y1="2" x2="16" y2="6"></line>
//                                 <line x1="8" y1="2" x2="8" y2="6"></line>
//                                 <line x1="3" y1="10" x2="21" y2="10"></line>
//                             </svg>
//                             <DatePicker
//                                 selected={selectedDate}
//                                 onChange={(date) => setSelectedDate(date)}
//                                 dateFormat="dd - MM - yyyy"
//                                 className="datepicker-custom-input"
//                                 calendarClassName="premium-calendar"
//                                 todayButton="Today"
//                                 popperPlacement="bottom-end"
//                             />
//                         </div>
//                     </div>
//                 </header>

//                 {/* --- 4. Form ko editingLog pass kiya --- */}
//                 <TimelogForm 
//                     selectedDate={getFormattedDate(selectedDate)} 
//                     onLogAdded={fetchAllLogs}
//                     editData={editingLog} 
//                     onCancelEdit={handleCancelEdit}
//                 />

//                 <div className="table-card" style={{ marginTop: '2rem' }}>
//                     {/* --- 5. Table ko onEdit handle pass kiya --- */}
//                     <TimelogTable 
//                         logs={logs} 
//                         setLogs={setLogs} 
//                         setDayTotal={setDayTotal}
//                         selectedDate={getFormattedDate(selectedDate)}
//                         onEdit={handleEditClick}
//                         fetchAllLogs={fetchAllLogs}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TimelogPage;
import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../style/Timelog.css';
import toast from "react-hot-toast";

import TimelogForm from '../../components/TimeLogForm';
import TimelogTable from '../../components/TimeLogTable';

const TimelogPage = () => {
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dayTotal, setDayTotal] = useState("0.00");
    const [editingLog, setEditingLog] = useState(null);

    const getFormattedDate = (date) => date.toISOString().split('T')[0];

    const fetchAllLogs = useCallback(async () => {
        const dateStr = getFormattedDate(selectedDate);
        try {
            const response = await fetch(`http://localhost:3000/intern/timelog?date=${dateStr}`, {
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok) {
                setLogs(result.data || []);
                setDayTotal(result.totalHours || "0.00");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [selectedDate]);

    useEffect(() => { fetchAllLogs(); }, [fetchAllLogs]);

    // --- 1. DELETE Logic ---
    const handleDelete = async (id) => {
        // if (!window.confirm("Are you sure you want to delete this entry?")) return;

        try {
            const response = await fetch(`http://localhost:3000/intern/timelog/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                 toast.success("TimeLog Deleted!", {
                    position: "top-center",
                    duration: 3000
                }); 
                fetchAllLogs(); 
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to delete", { position: "top-center" });

            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Server error while deleting");
            toast.error("Server error while deleting", { position: "top-center" });

        }
    };

    const handleEditClick = (log) => {
        setEditingLog(log);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingLog(null);
    };

    return (
        <div className="timelog-page-container">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header className="page-header-flex">
                    <h1 className="timelog-title">
                        TIMELOG : <span className="blue-hours">{dayTotal} HOURS</span>
                    </h1>
                    
                    <div className="datepicker-right-wrapper">
                        <div className="icon-input-container">
                            <svg className="calendar-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd - MM - yyyy"
                                className="datepicker-custom-input"
                                calendarClassName="premium-calendar"
                                todayButton="Today"
                                popperPlacement="bottom-end"
                            />
                        </div>
                    </div>
                </header>

                <TimelogForm 
                    selectedDate={getFormattedDate(selectedDate)} 
                    onLogAdded={fetchAllLogs}
                    editData={editingLog} 
                    onCancelEdit={handleCancelEdit}
                />

                <div className="table-card" style={{ marginTop: '2rem' }}>
                    <TimelogTable 
                        logs={logs} 
                        selectedDate={getFormattedDate(selectedDate)}
                        onEdit={handleEditClick}
                        onDelete={handleDelete} 
                        fetchAllLogs={fetchAllLogs}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimelogPage;