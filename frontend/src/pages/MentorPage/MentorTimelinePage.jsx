import React, { useEffect, useMemo, useState } from "react";
import "../../style/MentorTimeline.css";

export default function MentorTimelinePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [logs, setLogs] = useState([]);
  const [totalHours, setTotalHours] = useState("0.00");
  const [search, setSearch] = useState("");

  const getCategoryDetails = (cat) => {
    const type = cat?.toUpperCase();
    if (type === "CODING") return { icon: "💻", cls: "category-coding" };
    if (type === "LEARNING") return { icon: "📚", cls: "category-learning" };
    if (type === "MANAGEMENT") return { icon: "🤝", cls: "category-management" };
    return { icon: "📝", cls: "category-other" };
  };

  const fetchInterns = async () => {
    try {
      const res = await fetch("http://localhost:3000/mentor/interns", { credentials: "include" });
      const data = await res.json();
      setInterns(data);
      if (data.length > 0) setSelectedIntern(data[0]);
    } catch (e) { console.error(e); }
  };

  const fetchTimeline = async () => {
    if (!selectedIntern) return;
    try {
      const res = await fetch(`http://localhost:3000/mentor/intern-timeline/${selectedIntern._id}?date=${selectedDate}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) { setLogs(data.data); setTotalHours(data.totalHours); }
      else { setLogs([]); setTotalHours("0.00"); }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchInterns(); }, []);
  useEffect(() => { fetchTimeline(); }, [selectedIntern, selectedDate]);

  const filteredInterns = useMemo(() => 
    interns.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), 
  [interns, search]);

  const displayDate = (d) => d.split("-").reverse().join("-");

  return (
    <div className="mentor-timeline-layout">
      <div className="timeline-section">
        <div className="timeline-header">
          <div>
            <h1 className="main-title">{selectedIntern?.name}'s Timeline</h1>
            <p className="sub-title">📅 {displayDate(selectedDate)}</p>
          </div>
          <div className="total-badge">
            <p className="total-label">TOTAL HOURS</p>
            <div className="total-value">{totalHours}h</div>
          </div>
        </div>

        <div className="timeline-content-scroll">
          <div className="timeline-wrapper">
            {logs.map((log, index) => {
              const { icon, cls } = getCategoryDetails(log.category);
              return (
                <div key={log._id} className={`timeline-item ${index % 2 === 0 ? "left" : "right"} ${cls}-border animate-in`}>
                  <div className={`timeline-flag ${cls}`}>{icon} {log.category}</div>
                  <div className="time-badge">{log.startTime} — {log.endTime}</div>
                  <div className="log-description">{log.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="filter-panel">
        <h3 className="sidebar-title">Intern Directory</h3>
        <div className="input-container">
          <label className="input-label">SELECT DATE</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="modern-field" />
        </div>
        <div className="input-container">
          <label className="input-label">SEARCH INTERN</label>
          <input type="text" placeholder="Type name..." value={search} onChange={(e) => setSearch(e.target.value)} className="modern-field" />
        </div>
        <div className="intern-list">
          {filteredInterns.map(intern => (
            <div key={intern._id} className={`intern-item ${selectedIntern?._id === intern._id ? "active" : ""}`} onClick={() => setSelectedIntern(intern)}>
              <div className="intern-avatar">{intern.name.charAt(0).toUpperCase()}</div>
              <div className="intern-name-text">{intern.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}