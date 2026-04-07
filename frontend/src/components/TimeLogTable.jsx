// import React, { useEffect } from 'react'; 
// import { LuPencilLine, LuTrash2 } from "react-icons/lu";

// const TimelogTable = ({ selectedDate, logs, setLogs, setDayTotal, onEdit }) => {
    

//     return (
//         <table className="pro-table">
//             <thead>
//                 <tr>
//                     <th>START TIME</th>
//                     <th>END TIME</th>
//                     <th>HOURS</th>
//                     <th>CATEGORY</th>
//                     <th>DESCRIPTION</th>
//                     <th style={{ textAlign: 'right' }}>ACTIONS</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {logs.length > 0 ? logs.map((log) => (
//                     <tr key={log._id}>
//                         <td>{log.startTime}</td>
//                         <td>{log.endTime}</td>
//                         <td>{log.totalHours}</td>
//                         <td>
//                             <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
//                                 {log.category}
//                             </span>
//                         </td>
//                         <td>{log.description}</td>
//                         <td style={{ textAlign: 'right' }}>
//                             <div className="actions-wrapper">
//                                 {/* --- Pencil Icon per onEdit lagaya --- */}
//                                 <button 
//                                     className="action-btn edit-btn" 
//                                     onClick={() => onEdit(log)}
//                                 >
//                                     <LuPencilLine size={18} />
//                                 </button>

//                                 <button 
//                                     className="action-btn delete-btn" 
//                                     onClick={() => {/* handleDelete logic */}}
//                                 >
//                                     <LuTrash2 size={18} />
//                                 </button>
//                             </div>
//                         </td>
//                     </tr>
//                 )) : (
//                     <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No records found.</td></tr>
//                 )}
//             </tbody>
//         </table>
//     );
// };

// export default TimelogTable;
import React from 'react'; 
import { LuPencilLine, LuTrash2 } from "react-icons/lu";

// 1. Props mein 'onDelete' receive karein
const TimelogTable = ({ selectedDate, logs, setLogs, setDayTotal, onEdit, onDelete }) => {

    return (
        <table className="pro-table">
            <thead>
                <tr>
                    <th>START TIME</th>
                    <th>END TIME</th>
                    <th>HOURS</th>
                    <th>CATEGORY</th>
                    <th>DESCRIPTION</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {/* {logs.length > 0 ? logs.map((log) => (
                    <tr key={log._id}>
                        <td>{log.startTime}</td>
                        <td>{log.endTime}</td>
                        <td>{log.totalHours}</td>
                        <td>
                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                                {log.category}
                            </span>
                        </td>
                        <td>{log.description}</td>
                        <td style={{ textAlign: 'right' }}>
                            <div className="actions-wrapper">
                                <button 
                                    className="action-btn edit-btn" 
                                    onClick={() => onEdit(log)}
                                >
                                    <LuPencilLine size={18} />
                                </button>

                                <button 
                                    className="action-btn delete-btn" 
                                    onClick={() => onDelete(log._id)} 
                                >
                                    <LuTrash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No records found.</td></tr>
                )} */}
                {logs.map((log) => (
                    <tr key={log._id}>
                        <td>{log.startTime}</td>
                        <td>{log.endTime}</td>
                        <td>{log.totalHours}</td>
                        <td>
                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                                {log.category}
                            </span>
                        </td>
                        <td>{log.description}</td>
                        <td style={{ textAlign: 'right' }}>
                            <div className="actions-wrapper">
                                <button 
                                    className="action-btn edit-btn" 
                                    onClick={() => onEdit(log)}
                                >
                                    <LuPencilLine size={18} />
                                </button>

                                <button 
                                    className="action-btn delete-btn" 
                                    onClick={() => onDelete(log._id)} 
                                >
                                    <LuTrash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                 ))}
            </tbody>
        </table>
    );
};

export default TimelogTable;