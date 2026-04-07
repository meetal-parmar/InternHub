// // path: src/components/MonthlyCalendarView.jsx
// import React from 'react';
// import '../style/MonthlySummary.css'; // Common css

// const MonthlyCalendarView = ({ logs }) => {
//     // Generate static calendar grid for April 2026 based on image
//         const logsMap = {};
//     logs.forEach(log => {
//         const day = new Date(log._id).getDate();
//         logsMap[day] = log.dayTotal;
//     });
//     const calendarGrid = [
//         { d: 29, active: false }, { d: 30, active: false }, { d: 31, active: false }, { d: 1, active: true, h: 0 }, { d: 2, active: true, h: 0 }, { d: 3, active: true, h: 5.00 }, { d: 4, active: true, h: 0 },
//         { d: 5, active: true, h: 0 }, { d: 6, active: true, h: 4.00 }, { d: 7, active: true, h: 0 }, { d: 8, active: true, h: 0 }, { d: 9, active: true, h: 0 }, { d: 10, active: true, h: 0 }, { d: 11, active: true, h: 0 },
//         { d: 12, active: true, h: 0 }, { d: 13, active: true, h: 0 }, { d: 14, active: true, h: 0 }, { d: 15, active: true, h: 0 }, { d: 16, active: true, h: 0 }, { d: 17, active: true, h: 0 }, { d: 18, active: true, h: 0 },
//         { d: 19, active: true, h: 0 }, { d: 20, active: true, h: 0 }, { d: 21, active: true, h: 0 }, { d: 22, active: true, h: 0 }, { d: 23, active: true, h: 0 }, { d: 24, active: true, h: 0 }, { d: 25, active: true, h: 0 },
//         { d: 26, active: true, h: 0 }, { d: 27, active: true, h: 0 }, { d: 28, active: true, h: 0 }, { d: 29, active: true, h: 0 }, { d: 30, active: true, h: 0 }, { d: 1, active: false }, { d: 2, active: false }
//     ];

//     const weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

//     // NOTE: Map real 'logs' to update 'h' values (Dynamic data mapping needed here)

//     return (
//         <div className="calendar-card">
//             {/* Header: Weekdays */}
//             <div className="calendar-weekday-grid">
//                 {weekDays.map(day => <div key={day} className="weekday-label">{day}</div>)}
//             </div>

           
// <div className="calendar-date-grid">
//     {calendarGrid.map((day, index) => {
//         const hours = logsMap[day.d] || 0;

//         // ✅ WEEKEND CHECK (0 = Sunday, 6 = Saturday)
//         const isWeekend = index % 7 === 0 || index % 7 === 6;

//         return (
//             <div
//                 key={index}
//                 className={`date-cell 
//                     ${day.active ? 'current-month' : 'other-month'} 
//                     ${hours > 0 ? 'logged-day' : ''} 
//                     ${isWeekend ? 'weekend-cell' : ''}  // ✅ ADD THIS
//                 `}
//             >
//                 <span className="date-number">
//                     {day.d < 10 ? `0${day.d}` : day.d}
//                 </span>

//                 {hours > 0 && (
//                     <span className="hours-logged">
//                         {hours.toFixed(2)}
//                     </span>
//                 )}

//                 {day.active && hours === 0 && index > 10 && (
//                     <span className="red-dot"></span>
//                 )}
//             </div>
//         );
//     })}
// </div>
//         </div>
//     );
// };

// export default MonthlyCalendarView;
import React from 'react';
import '../style/MonthlySummary.css';

const MonthlyCalendarView = ({ logs, month, year }) => {

    // ✅ Logs ko map karo (day -> hours)
    const logsMap = {};
    logs.forEach(log => {
        const day = new Date(log._id).getDate();
        logsMap[day] = log.dayTotal;
    });

    // ✅ Dynamic Calendar Generator
    const generateCalendar = (month, year) => {
        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const prevMonthDays = new Date(year, month - 1, 0).getDate();

        let calendar = [];

        // 🔹 Previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            calendar.push({
                d: prevMonthDays - i,
                active: false
            });
        }

        // 🔹 Current month
        for (let i = 1; i <= daysInMonth; i++) {
            calendar.push({
                d: i,
                active: true
            });
        }

        // 🔹 Next month fill (42 boxes)
        let nextDay = 1;
while (calendar.length % 7 !== 0) {
    calendar.push({
        d: nextDay++,
        active: false
    });
}

        return calendar;
    };

    const calendarGrid = generateCalendar(month, year);

    const weekDays = [
        "SUNDAY", "MONDAY", "TUESDAY",
        "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
    ];

    return (
        <div className="calendar-card">

            {/* Week Days */}
            <div className="calendar-weekday-grid">
                {weekDays.map(day => (
                    <div key={day} className="weekday-label">{day}</div>
                ))}
            </div>

            {/* Dates Grid */}
            <div className="calendar-date-grid">
                {calendarGrid.map((day, index) => {

                    // ✅ Only current month logs
                    const hours = day.active ? (logsMap[day.d] || 0) : 0;

                    // ✅ Weekend detect
                    const isWeekend = index % 7 === 0 || index % 7 === 6;

                    return (
                        <div
                            key={index}
                            className={`date-cell 
                                ${day.active ? 'current-month' : 'other-month'} 
                                ${hours > 0 ? 'logged-day' : ''} 
                                ${isWeekend ? 'weekend-cell' : ''}
                            `}
                        >
                            <span className="date-number">
                                {day.d < 10 ? `0${day.d}` : day.d}
                            </span>

                            {hours > 0 && (
                                <span className="hours-logged">
                                    {hours.toFixed(2)}
                                </span>
                            )}

                            {day.active && hours === 0 && index > 10 && (
                                <span className="red-dot"></span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthlyCalendarView;