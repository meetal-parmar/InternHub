


const Task = require("../models/Task");
const User = require("../models/usersModel");


const Leave = require("../models/Leave");
const Notification = require("../models/Notification");

exports.getDashboardStats = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const totalInterns = await User.countDocuments({
      mentor: mentorId,
      role: "INTERN",
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayLeaveList = await Leave.find({
      mentorId,
      status: "Approved",
      fromDate: { $lte: todayEnd },
      toDate: { $gte: todayStart },
    }).populate("internId", "name");

    const onLeaveInterns = todayLeaveList.length;

    const newLeaveApply = await Leave.countDocuments({
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
        todayLeaveList,
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

    for (let i = 4; i >= 0; i--) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);

      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const onLeaveCount = await Leave.countDocuments({
        mentorId,
        status: "Approved",
        fromDate: { $lte: dayEnd },
        toDate: { $gte: dayStart },
      });

      trends.push({
        day: dayStart.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        present: totalInterns - onLeaveCount,
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

    
    
    notifications = await Notification.find({
      userId: req.user._id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(10);
    

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

