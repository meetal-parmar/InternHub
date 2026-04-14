


const Task = require("../models/Task");
const User = require("../models/usersModel");

// ⏳ UNCOMMENT AFTER FRIEND MERGE
const Leave = require("../models/Leave");
const Notification = require("../models/Notification");

exports.getDashboardStats = async (req, res) => {
  try {
    const mentorId = req.user._id;

    // ✅ total interns assigned to mentor
    const totalInterns = await User.countDocuments({
      mentor: mentorId,
      role: "INTERN",
    });

    let onLeaveInterns = 0;
    let newLeaveApply = 0;

    
    // ⏳ UNCOMMENT AFTER FRIEND MERGE
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    onLeaveInterns = await Leave.countDocuments({
      mentorId,
      status: "Approved",
      fromDate: { $lte: today },
      toDate: { $gte: today },
    });

    newLeaveApply = await Leave.countDocuments({
      mentorId,
      status: "Pending",
    });
    

    const newTaskSubmission = await Task.countDocuments({
      mentorId,
      status: { $in: ["Submitted", "Under Review"] },
    });

    const presentInterns = totalInterns - onLeaveInterns;

    res.status(200).json({
      success: true,
      stats: {
        totalInterns,
        presentInterns,
        onLeaveInterns,
        newTaskSubmission,
        newLeaveApply,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

exports.getAttendanceTrends = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const trends = [];

    const totalInterns = await User.countDocuments({
      mentor: mentorId,
      role: "INTERN",
    });

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    for (let i = 0; i < 5; i++) {
      trends.push({
        day: days[i],
        present: totalInterns,
      });
    }

    res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    console.error("Attendance trend error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance trends",
    });
  }
};

exports.getMentorNotifications = async (req, res) => {
  try {
    let notifications = [];

    
    // ⏳ UNCOMMENT AFTER FRIEND MERGE
    notifications = await Notification.find({
      userId: req.user._id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);
    

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Notification fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};