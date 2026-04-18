// path: src/components/MonthlyAnalysisPanel.jsx
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import '../style/MonthlySummary.css'; // Common css

const MonthlyAnalysisPanel = ({ data }) => {
   const COLORS = ['#dbeafe', '#2563eb', '#cbd5e1', '#1e293b'];
    const kpiCards = [
        { label: "Total Monthly Hours", value: `${data.totalHours || 0} HOURS`, icon: "⏱️", key: "total_hrs" },
        { label: "Days Worked", value: `${data.daysWorked || 0} DAYS`, icon: "📅", key: "days_worked" },
        { label: "Avg. Daily Hours", value: `${data.avgDailyHours || 0} HOURS`, icon: "🎯", key: "avg_hrs" },
        { label: "Most Active Category", value: (data.mostActiveCategory || "CODING"), icon: "🚀", key: "most_active" }
    ];

    return (
        <div className="analysis-wrapper-flex">
            {/* --- TOP: Category Pie Breakup --- */}
            <div className="pie-analysis-section">
                <h3 className="section-title">CATEGORY BREAKUP</h3>
                {data.categoryBreakup && data.categoryBreakup.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data.categoryBreakup}
                                cx="50%" cy="50%"
                                innerRadius={50} outerRadius={80}
                                fill="#8884d8"
                                dataKey="totalHours"
                                label
                            >
                                {data.categoryBreakup.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="no-data">No breakup data available.</p>
                )}
            </div>

            {/* --- BOTTOM: KPIs Cards --- */}
            <div className="kpi-panel-section">
                <h3 className="section-title">KEY PERFORMANCE INDICATORS</h3>
                <div className="kpi-card-grid">
                    {kpiCards.map(card => (
                        <div key={card.key} className="kpi-card professional-border">
                            <span className="kpi-icon">{card.icon}</span>
                            <div className="kpi-content">
                                <span className="kpi-label">{card.label}</span>
                                <span className="kpi-value">{card.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MonthlyAnalysisPanel;