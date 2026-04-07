import React, { useState, useRef, useEffect } from 'react';

const TimePicker = ({ value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef();

    // Internal states jo dropdown ke selections ko track karengi
    const [h, setH] = useState("09");
    const [m, setM] = useState("00");
    const [p, setP] = useState("AM");

    // ✅ FIX: Jab parent (TimelogForm) se value badlegi (e.g. 5 PM se 6 PM), 
    // tab ye useEffect internal state ko update kar dega.
    useEffect(() => {
        if (value) {
            const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (match) {
                setH(match[1]);
                setM(match[2]);
                setP(match[3].toUpperCase());
            }
        }
    }, [value]);

    // Value change handle karne ka function
    const handleValueChange = (newH, newM, newP) => {
        setH(newH);
        setM(newM);
        setP(newP);
        // Parent ko batana ki time badal gaya hai
        onChange(`${newH}:${newM} ${newP}`);
    };

    // Outside click detector (dropdown band karne ke liye)
    useEffect(() => {
        const handler = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="time-picker-container" style={{ position: 'relative', width: '100%' }}>
            {/* Time Box: Hamesha current value dikhayega */}
            <div className="time-box" onClick={() => setShowPicker(!showPicker)}>
                {value}
            </div>

            {showPicker && (
                <div className="custom-time-dropdown" ref={pickerRef}>
                    <div className="picker-columns">
                        {/* Hours Column */}
                        <div className="column">
                            {["01","02","03","04","05","06","07","08","09","10","11","12"].map(num => (
                                <div key={num}
                                    className={h === num ? "active" : ""}
                                    onClick={() => handleValueChange(num, m, p)}>
                                    {num}
                                </div>
                            ))}
                        </div>

                        {/* Minutes Column */}
                        <div className="column">
                            {["00","15","30","45"].map(num => (
                                <div key={num}
                                    className={m === num ? "active" : ""}
                                    onClick={() => handleValueChange(h, num, p)}>
                                    {num}
                                </div>
                            ))}
                        </div>

                        {/* AM/PM Column */}
                        <div className="column">
                            {["AM","PM"].map(num => (
                                <div key={num}
                                    className={p === num ? "active" : ""}
                                    onClick={() => handleValueChange(h, m, num)}>
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button type="button" className="ok-btn" onClick={() => setShowPicker(false)}>
                        OK
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimePicker;