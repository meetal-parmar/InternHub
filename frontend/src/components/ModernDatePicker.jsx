import React, { useState, useRef, useEffect } from "react";

const ModernDatePicker = ({ selectedDate, onDateChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    const ref = useRef();

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const handleSelect = (day) => {
        const newDate = new Date(year, month, day);
        onDateChange(newDate);
        setIsOpen(false);
    };

    return (
        <div className="datepicker-container" ref={ref}>

            {/* INPUT BOX */}
            <div className="datepicker-input" onClick={() => setIsOpen(!isOpen)}>
                📅 {selectedDate.toLocaleDateString("en-GB")}
            </div>

            {/* CALENDAR */}
            {isOpen && (
                <div className="datepicker-popup">

                    {/* HEADER */}
                    <div className="dp-header">
                        <button onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                            ◀
                        </button>

                        <span>{months[month]} {year}</span>

                        <button onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                            ▶
                        </button>
                    </div>

                    {/* DAYS */}
                    <div className="dp-grid">
                        {days.map(d => <div key={d} className="dp-day">{d}</div>)}

                        {/* EMPTY SPACE */}
                        {Array(firstDay).fill().map((_, i) => (
                            <div key={i}></div>
                        ))}

                        {/* DATES */}
                        {Array.from({ length: totalDays }, (_, i) => (
                            <div
                                key={i}
                                className="dp-date"
                                onClick={() => handleSelect(i + 1)}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
};

export default ModernDatePicker;