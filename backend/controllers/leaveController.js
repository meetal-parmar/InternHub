// controllers/leaveController.js
const Leave = require("../models/Leave");
//const Notification = require("../models/Notification");
const User = require("../models/usersModel");

exports.applyLeave = async (req, res) => {
  try {
    // 1. req.user._id (intern ki ID) authMiddleware se aayegi
    const internId = req.user._id;

    // 2. Database se Intern ka assigned mentor dhoondo
    const currentUser = await User.findById(internId);
    console.log(currentUser.mentor);
    
    // Safety Check: Kya mentor assigned hai?
    if (!currentUser.mentor) {
      return res.status(400).json({ 
        success: false, 
        message: "no mantor assign." 
      });
    }

    const { fromDate, toDate, type, reason } = req.body;

    const days = Math.floor((new Date(toDate) - new Date(fromDate)) / (1000*60*60*24)) + 1;

    // 3. Leave Entry Create Karein
    const leave = await Leave.create({
      internId: internId,
      mentorId: currentUser.mentor, // Model se dynamic ID uthayi
      fromDate,
      toDate,
      days,
      type,
      reason
    });

    // 4. Mentor ko Notification Bhejein
    await Notification.create({
      userId: currentUser.mentor, // Mentor ki ID
      title: "New Leave Application",
      message: `${currentUser.name} has applied for ${type} leave for ${days} days.`,
      type: "leave_apply",
      relatedId: leave._id,
    });

    res.status(201).json({ 
      success: true, 
      message: "Leave applied successfully and mentor notified!",
      leave 
    });

  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

    // 📧 Send Email
    // if (sendMail) {
    //   const mentor = await User.findById(mentorId);
    //   await sendEmail({
    //     to: mentor.email,
    //     subject: "Leave Request",
    //     text: emailText || `New leave request from ${req.user.name}`,
    //   });
    // }

//     res.json({ success: true, leave });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// UPDATE STATUS - Mentor Only
exports.updateStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = status;
    await leave.save();

    // ⏳ UNCOMMENT AFTER FRIEND PUSHES NOTIFICATION
    /*
    let notificationType =
      status === "Approved"
        ? "leave_approved"
        : "leave_rejected";

    await Notification.create({
      userId: leave.internId,
      title: `Leave ${status}`,
      message: `Your leave has been ${status}`,
      type: notificationType,
      relatedId: leave._id,
    });
    */

    res.json({
      success: true,
      leave,
    });
  } catch (error) {
    console.error("Update leave status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE LEAVE (Cancel) - Intern Only
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.internId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await leave.deleteOne();
    res.json({ success: true, message: "Leave canceled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Intern Leaves
exports.getInternLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ internId: req.user._id });

    const approvedLeaves = leaves.filter(l => l.status === "Approved");
    const pendingLeaves = leaves.filter(l => l.status === "Pending");
    const rejectedLeaves = leaves.filter(l => l.status === "Rejected");

    // ✅ ONLY approved ka sum
    const used = approvedLeaves.reduce((sum, l) => {
      return sum + (l.days || 0);
    }, 0);

    res.json({
      history: leaves,
      summary: {
        total: 12,
        used: used,
        pending: pendingLeaves.length,
        approved: approvedLeaves.length,
        rejected: rejectedLeaves.length
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Mentor Assigned Leaves
// exports.getMentorLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find({ mentorId: req.user._id }).populate("internId", "name email");
//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.getMentorLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      mentorId: req.user._id,
    }).populate("internId");

    res.json(leaves);
  } catch (error) {
    console.error("Mentor leaves fetch error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};