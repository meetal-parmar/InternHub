
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { X, Calendar, Clock, CheckCircle, AlertCircle, Sparkles, Inbox } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../style/LeavesPage.css';

const LeavesPage = () => {
  const todayFormatted = new Date().toLocaleDateString('en-GB'); // Ye "09/04/2026" return karega
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState({ total: 12, used: 0, pending: 0, approved: 0, rejected: 0 });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [formData, setFormData] = useState({
        fromDate: '', toDate: '', type: 'Sick', reason: '', sendMail: false
    });

    // DatePicker state
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Fetch leaves data
    const fetchLeavesData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/leaves/intern', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            console.log("API RESPONSE:", data);
            if (response.ok) {
    setLeaves(data.history || []);   // ✅ IMPORTANT
    setStats(data.summary || {
        total: 12, used: 0, pending: 0, approved: 0, rejected: 0
    });
}
        } catch (err) {
            console.error("Data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeavesData();
    }, []);

    // Handle date changes
    const handleStartDate = (date) => {
        setStartDate(date);
        setFormData({ ...formData, fromDate: date });
        if (endDate && date > endDate) setEndDate(null);
    };
    const handleEndDate = (date) => {
        setEndDate(date);
        setFormData({ ...formData, toDate: date });
    };

    // Calculate days
const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);

    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return end >= start ? diffInDays + 1 : 0;
};

    // Submit leave
    const handleApplyLeave = async (e) => {
    e.preventDefault();

    const days = calculateDays();

    if (!startDate || !endDate || days <= 0) {
        toast.error("Please select valid dates");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/leaves/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                fromDate: startDate.toISOString(),
                toDate: endDate.toISOString(),
                type: formData.type,
                reason: formData.reason,
                days: days
            })
        });

        const resData = await res.json(); // ✅ correct

        console.log("API DATA:", resData);

        if (res.ok) {
            toast.success("Leave Applied Successfully!");
            setShowModal(false);

            setFormData({
                type: 'Sick',
                reason: '',
                sendMail: false
            });

            setStartDate(new Date());
            setEndDate(new Date());

            fetchLeavesData();
        } else {
            toast.error(resData.message || "Failed to apply leave");
        }

    } catch (err) {
        toast.error("Server error");
    }
};
const handleCancelLeave = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/leaves/cancel/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Leave cancelled successfully");
      fetchLeavesData(); // table refresh
    } else {
      toast.error(data.message || "Failed to cancel");
    }

  } catch (err) {
    toast.error("Server error");
  }
};

    const usedPercent = ((stats?.used ?? 0) / (stats?.total ?? 1)) * 100;
    const remainingPercent = (((stats?.total ?? 0) - (stats?.used ?? 0)) / (stats?.total ?? 1)) * 100;

    const filteredLeaves = statusFilter === "ALL"
  ? leaves
  : leaves.filter(l => l.status === statusFilter);

  // Inside your component
// Prepare an array of all previously taken leave dates
// Only consider Approved leaves
const approvedLeaveRanges = leaves
  .filter(l => l.status === 'Approved')
  .map(l => ({
    from: new Date(l.fromDate).setHours(0,0,0,0),
    to: new Date(l.toDate).setHours(0,0,0,0)
  }));

// Function to disable dates
const isDateDisabled = (date) => {
  const d = new Date(date).setHours(0,0,0,0);
  const today = new Date().setHours(0,0,0,0);

  // Disable past dates
  if (d < today) return true;

  // Disable dates that are in approved leave ranges
  return approvedLeaveRanges.some(range => d >= range.from && d <= range.to);
};

    return (
        <div className={`leave-dashboard-wrapper ${showModal ? 'content-blurred' : ''}`}>
            <Toaster position="top-right" />

            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header">
                    <h2 className="dashboard-title m-0">Intern Leave Dashboard</h2>
                    <button className="btn-apply-primary-new" onClick={() => setShowModal(true)}>
                        <Sparkles size={18} className="me-2" /> Apply New Leave
                    </button>
                </div>

                {/* Leave Balance */}
                <p className="section-label">Leave Balance</p>
                <div className="row balance-row mb-5">
                    <div className="col-md-4">
                        <div className="balance-card total">
                            <div className="card-content">
                                <span className="card-label">Total Balance</span>
                                <div className="card-value">
                                    <span className="number blue" style={{ fontWeight: 250 }}>{stats.total}</span>
                                    <span className="unit">leaves</span>
                                </div>
                            </div>
                            <div className="progress-box">
                                <div className="circular-progress blue-ring" style={{ '--percent': '100%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="balance-card used">
                            <div className="card-content">
                                <span className="card-label">Used Leaves</span>
                                <div className="card-value">
                                    <span className="number red" style={{ fontWeight: 250 }}>{stats.used}</span>
                                    <span className="unit">leaves</span>
                                </div>
                            </div>
                            <div className="progress-box">
                                <div className="circular-progress red-ring" style={{ '--percent': `${usedPercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="balance-card remaining">
                            <div className="card-content">
                                <span className="card-label">Remaining</span>
                                <div className="card-value">
                                    <span className="number green" style={{ fontWeight: 250 }}>{stats.total - stats.used}</span>
                                    <span className="unit">leaves</span>
                                </div>
                            </div>
                            <div className="progress-box">
                                <div className="circular-progress green-ring" style={{ '--percent': `${remainingPercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leave Status */}
                <p className="section-label">Leave Status Summary</p>
                <div className="row balance-row mb-5">
                    {[
                        { label: 'Pending', icon: <Clock size={18} />, color: 'pending', val: stats.pending },
                        { label: 'Approved', icon: <CheckCircle size={18} />, color: 'approved', val: stats.approved },
                        { label: 'Rejected', icon: <AlertCircle size={18} />, color: 'rejected', val: stats.rejected }
                    ].map((item) => (
  <div className="col-md-4" key={item.label}>
    <div 
      className={`summary-pill-new ${item.color} shadow-sm h-100`}
      onClick={() => setStatusFilter(item.label)}  // 🔥 CLICK
      style={{ cursor: "pointer" }}
    >
      <div className="pill-icon-box">{item.icon}</div>
      <div className="pill-content">
        <span className="count-new">{item.val || 0}</span>
        <span className="txt-new">{item.label}</span>
      </div>
    </div>
  </div>
))}
                </div>

                {/* Leaves Table */}
                <div className="table-container-new shadow-sm bg-white mb-4">
                    <div className="table-header-new">
                        <Calendar size={18} className="me-2" /> MY LEAVES TABLE
                    </div>
                    
                    <Table responsive hover className="m-0 custom-table-new text-center">
                        <thead>
                            <tr>
                                <th>FROM</th><th>TO</th><th>DAYS</th><th>TYPE</th><th>REASON</th><th>STATUS</th><th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="p-4">Loading data...</td></tr>
                            ) : filteredLeaves.length > 0 ? filteredLeaves.map((l, index) => (
                                <tr key={index}>
                                    <td>{new Date(l.fromDate).toLocaleDateString('en-GB')}</td>
                                    <td>{new Date(l.toDate).toLocaleDateString('en-GB')}</td>
                                    <td><span className="days-badge">{l.days}</span></td>
                                    <td>{l.type}</td>
                                    <td className="text-truncate" style={{ maxWidth: '150px' }}>{l.reason}</td>
                                    <td><span className={`status-badge-new ${l.status.toLowerCase()}`}>{l.status}</span></td>
                                        <td>
                                {l.status === 'Pending' ? (
    <button 
      className="btn-cancel-ghost"
      onClick={() => handleCancelLeave(l._id)}
    >
      Cancel
    </button>
  ) : '-'}
</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-5 text-center">
                                        <Inbox size={40} className="text-muted mb-2" />
                                        <p className="m-0 text-muted">No records found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* --- GLASSMORPHISM MODAL --- */}
{showModal && (
                <div className="glass-modal-overlay">
                    <div className="glass-modal-card">
                        <div className="modal-header-custom">
                            <h3 className="modal-title-new">Apply for Leave</h3>
                           <button 
    className="modal-close-icon" 
    onClick={() => setShowModal(false)}
    type="button" /* Default behavior prevent karne ke liye */
>
    <X size={24} strokeWidth={2.5} />
</button>
                        </div>

                        <form className="modal-form-body" onSubmit={handleApplyLeave}>
                            {/* Date Section */}
                            <div className="form-row-custom">
                                <div className="date-range-container">
                                    <label className="custom-label">Select date range</label>
                                    <div className="datepicker-group">
                                        <div className="date-input-wrapper">
                                            <Calendar size={16} className="date-icon" />
                                            <DatePicker
    selected={startDate}
    onChange={handleStartDate}
    dateFormat="dd/MM/yyyy"
    selectsStart
    startDate={startDate}
    endDate={endDate}
    placeholderText={todayFormatted}
    className="modern-input"
    filterDate={(date) => !isDateDisabled(date)}
/>
                                        </div>
                                        <span className="date-separator">to</span>
                                        <div className="date-input-wrapper">
                                            <Calendar size={16} className="date-icon" />
                                            
<DatePicker
    selected={endDate}
    onChange={handleEndDate}
    dateFormat="dd/MM/yyyy"
    selectsEnd
    startDate={startDate}
    endDate={endDate}
    minDate={startDate}
    placeholderText={todayFormatted}
    className="modern-input"
    filterDate={(date) => !isDateDisabled(date)}
/>
                                        </div>
                                    </div>
                                </div>

                                <div className="days-counter-wrapper">
                                    <label className="custom-label">Duration</label>
                                    <div className="days-badge-modern">
                                        <span className="days-number">{calculateDays()}</span>
                                        <span className="days-text">Days</span>
                                    </div>
                                </div>
                            </div>

                            {/* Leave Type */}
                            <div className="form-group-custom">
                                <label className="custom-label">Leave type</label>
                                <select 
                                    className="modern-input select-custom"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option>Sick</option>
                                    <option>Casual</option>
                                    <option>Half Leave</option>
                                </select>
                            </div>

                            {/* Reason */}
                            <div className="form-group-custom">
                                <label className="custom-label">Reason for leave</label>
                                <textarea
                                    className="modern-input textarea-custom"
                                    rows={3}
                                    placeholder="Briefly describe your reason..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    required
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div className="modal-footer-custom">
                                {/* <button type="button" className="btn-modern-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button> */}
                                <button type="submit" className="btn-modern-apply">
                                    Apply Leave
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeavesPage;