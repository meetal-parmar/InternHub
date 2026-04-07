// // path: src/pages/intern/MonthlySummaryPage.jsx
// import React, { useState, useEffect } from 'react';
// import MonthlyCalendarView from '../../components/MonthlyCalendarView';
// import MonthlyAnalysisPanel from '../../components/MonthlyAnalysisPanel';
// import '../../style/MonthlySummary.css';

// const MonthlySummaryPage = () => {
//     const [monthlyData, setMonthlyData] = useState({
//         logs: [],
//         totalHours: 0,
//         daysWorked: 0,
//         avgDailyHours: 0,
//         categoryBreakup: []
//     });
//     const [selectedMonth, setSelectedMonth] = useState({ month: 4, year: 2026 }); // Default from Image

//     const fetchMonthlyAnalysis = async (month, year) => {
//     try {
//         const response = await fetch(
//             `http://localhost:3000/intern/monthlySummary?month=${month}&year=${year}`, // ✅ FIXED
//             { credentials: 'include' }
//         );

//         const result = await response.json();
//         console.log("API DATA:", result); // DEBUG

//         if (response.ok) {
//             setMonthlyData(result.data);
//         }
//     } catch (error) {
//         console.error("Monthly Fetch error:", error);
//     }
// };

//     useEffect(() => {
//         fetchMonthlyAnalysis(selectedMonth.month, selectedMonth.year);
//     }, [selectedMonth]);

//     // Handle Month Navigation
//    const changeMonth = (direction) => {
//     let { month, year } = selectedMonth;

//     month += direction;

//     if (month < 1) {
//         month = 12;
//         year -= 1;
//     }
//     if (month > 12) {
//         month = 1;
//         year += 1;
//     }

//     setSelectedMonth({ month, year });
// };

//     return (
//         <div className="monthly-summary-container">
//             {/* 1. Header with Month Selector */}
//             <header className="monthly-page-header">
//                 {/* <h1 className="monthly-page-title">
//                     TIMELOG : <span className="blue-title">Monthly Summary</span>
//                 </h1> */}
//                 <div className="month-navigation">
//                     <button onClick={() => changeMonth(-1)}>{"<"}</button>
//                     <span className="current-month">
//     {new Date(selectedMonth.year, selectedMonth.month - 1).toLocaleString('default', {
//         month: 'long',
//         year: 'numeric'
//     })}
// </span>
//                     <button onClick={() => changeMonth(1)}>{">"}</button>
//                 </div>
//             </header>

//             {/* 2. Main Flex Layout */}
//             <div className="main-layout-flex">
//                 {/* 3. Left Panel (Calendar View from your image) */}
//                 <div className="left-panel-calendar">
//                     <MonthlyCalendarView logs={monthlyData.logs} />
//                 </div>

//                 {/* 4. Right Panel (Pie Chart & KPIs from your request) */}
//                 <div className="right-panel-analysis">
//                     <MonthlyAnalysisPanel data={monthlyData} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MonthlySummaryPage;

import React, { useState, useEffect } from 'react';
import MonthlyCalendarView from '../../components/MonthlyCalendarView';
import MonthlyAnalysisPanel from '../../components/MonthlyAnalysisPanel';
import '../../style/MonthlySummary.css';

const MonthlySummaryPage = () => {
    const [monthlyData, setMonthlyData] = useState({
        logs: [],
        totalHours: 0,
        daysWorked: 0,
        avgDailyHours: 0,
        categoryBreakup: []
    });

    const [selectedMonth, setSelectedMonth] = useState({ month: 4, year: 2026 });

    const fetchMonthlyAnalysis = async (month, year) => {
        try {
            const response = await fetch(
                `http://localhost:3000/intern/monthlySummary?month=${month}&year=${year}`,
                { credentials: 'include' }
            );

            const result = await response.json();
            console.log("API DATA:", result);

            if (response.ok) {
                setMonthlyData(result.data);
            }
        } catch (error) {
            console.error("Monthly Fetch error:", error);
        }
    };

    useEffect(() => {
        fetchMonthlyAnalysis(selectedMonth.month, selectedMonth.year);
    }, [selectedMonth]);

    const changeMonth = (direction) => {
        let { month, year } = selectedMonth;

        month += direction;

        if (month < 1) {
            month = 12;
            year -= 1;
        }
        if (month > 12) {
            month = 1;
            year += 1;
        }

        setSelectedMonth({ month, year });
    };

    return (
        <div className="monthly-summary-container">

            {/* <header className="monthly-page-header">
                <div className="month-navigation">
                    <button onClick={() => changeMonth(-1)}>{"<"}</button>

                    <span className="current-month">
                        {new Date(selectedMonth.year, selectedMonth.month - 1)
                            .toLocaleString('default', {
                                month: 'long',
                                year: 'numeric'
                            })}
                    </span>

                    <button onClick={() => changeMonth(1)}>{">"}</button>
                </div>
            </header> */}
            <header className="monthly-page-header">
    {/* <div className="header-left">
        <h1 className="monthly-page-title">
            TIMELOG : <span className="blue-title">Monthly Summary</span>
        </h1>
    </div> */}

    <div className="month-navigation">
        <button className="nav-btn" onClick={() => changeMonth(-1)}>
            <i className="chevron-left"></i> ❮
        </button>
        
        <div className="month-display">
            <span className="calendar-icon">📅</span>
            <span className="current-month-text">
                {new Date(selectedMonth.year, selectedMonth.month - 1)
                    .toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
        </div>

        <button className="nav-btn" onClick={() => changeMonth(1)}>
            ❯ <i className="chevron-right"></i>
        </button>
    </div>
</header>

            <div className="main-layout-flex">

                <div className="left-panel-calendar">
                    {/* ✅ FIXED */}
                    <MonthlyCalendarView 
                        logs={monthlyData.logs}
                        month={selectedMonth.month}
                        year={selectedMonth.year}
                    />
                </div>

                <div className="right-panel-analysis">
                    <MonthlyAnalysisPanel data={monthlyData} />
                </div>

            </div>
        </div>
    );
};

export default MonthlySummaryPage;