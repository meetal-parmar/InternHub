import React, { useState, useEffect } from 'react';
import MonthlyCalendarView from '../components/MonthlyCalendarView';
import MonthlyAnalysisPanel from '../components/MonthlyAnalysisPanel';
import '../style/MonthlySummary.css';
const BASE_URL = import.meta.env.VITE_API_URL;


const MentorMonthlySummaryPage = () => {

    const [interns, setInterns] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState("");

    const [monthlyData, setMonthlyData] = useState({
        logs: [],
        totalHours: 0,
        daysWorked: 0,
        avgDailyHours: 0,
        categoryBreakup: [],
        mostActiveCategory: "N/A"
    });

    const [selectedMonth, setSelectedMonth] = useState({ month: 4, year: 2026 });

    // 🔹 Fetch interns
    useEffect(() => {
        fetch(`${BASE_URL}/mentor/interns`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            console.log("Intern API:", data);

            // ✅ FINAL FIX (handles array + object)
            const internList = Array.isArray(data)
                ? data
                : data.interns || data.data?.interns || data.data || [];

            setInterns(internList);

            if (internList.length > 0) {
                setSelectedIntern(internList[0]._id);
            }
        })
        .catch(err => {
            console.error("Intern fetch error:", err);
            setInterns([]);
        });
    }, []);

    // 🔹 Fetch monthly data
    const fetchMonthlyAnalysis = async () => {
        try {
            if (!selectedIntern) return;

            const res = await fetch(
                `${BASE_URL}/mentor/monthlySummary/${selectedIntern}?month=${selectedMonth.month}&year=${selectedMonth.year}`,
                { credentials: 'include' }
            );

            const result = await res.json();
            console.log("Monthly API:", result);

            if (res.ok && result.data) {
                setMonthlyData({
                    logs: result.data.logs || [],
                    totalHours: result.data.totalHours || 0,
                    daysWorked: result.data.daysWorked || 0,
                    avgDailyHours: result.data.avgDailyHours || 0,
                    categoryBreakup: result.data.categoryBreakup || [],
                    mostActiveCategory: result.data.mostActiveCategory || "N/A"
                });
            } else {
                setMonthlyData({
                    logs: [],
                    totalHours: 0,
                    daysWorked: 0,
                    avgDailyHours: 0,
                    categoryBreakup: [],
                    mostActiveCategory: "N/A"
                });
            }

        } catch (error) {
            console.error("Monthly Fetch error:", error);
        }
    };

    useEffect(() => {
        fetchMonthlyAnalysis();
    }, [selectedIntern, selectedMonth]);

    // 🔹 Month change handler
    const changeMonth = (dir) => {
        let { month, year } = selectedMonth;

        month += dir;

        if (month < 1) {
            month = 12;
            year--;
        }

        if (month > 12) {
            month = 1;
            year++;
        }

        setSelectedMonth({ month, year });
    };

    return (
        <div className="monthly-summary-container">

            {/* 🔥 HEADER */}
            <header className="monthly-page-header">

                {/* Month Navigation */}
                <div className="month-navigation">
                    <button className="nav-btn" onClick={() => changeMonth(-1)}>❮</button>

                    <div className="month-display">
                        📅 {new Date(selectedMonth.year, selectedMonth.month - 1)
                            .toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>

                    <button className="nav-btn" onClick={() => changeMonth(1)}>❯</button>
                </div>

                {/* 🔥 INTERN DROPDOWN */}
                <select
                    className="intern-dropdown"
                    value={selectedIntern}
                    onChange={(e) => setSelectedIntern(e.target.value)}
                >
                    <option value="">Select Intern</option>

                    {(interns || []).map(intern => (
                        <option key={intern._id} value={intern._id}>
                            {intern.name || "No Name"}
                        </option>
                    ))}
                </select>

            </header>

            {/* MAIN LAYOUT */}
            <div className="main-layout-flex">

                {/* LEFT: Calendar */}
                <div className="left-panel-calendar">
                    <MonthlyCalendarView
                        logs={monthlyData.logs || []}
                        month={selectedMonth.month}
                        year={selectedMonth.year}
                    />
                </div>

                {/* RIGHT: Analysis */}
                <div className="right-panel-analysis">
                    <MonthlyAnalysisPanel data={monthlyData} />
                </div>

            </div>

        </div>
    );
};

export default MentorMonthlySummaryPage;