
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
