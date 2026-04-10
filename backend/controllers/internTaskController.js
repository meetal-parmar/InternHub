const Task = require("../models/Task");

// 1. Fetch All Tasks with Overdue Logic
exports.getInternTasks = async (req, res) => {
  try {
    const status = req.query.status;

    let query = { internId: req.user._id };

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate("mentorId", "name email")
      .sort({ deadline: 1 });

    const today = new Date();

    for (let task of tasks) {
      if (
        today > new Date(task.deadline) &&
        !["Approved", "Submitted", "Under Review"].includes(task.status)
      ) {
        if (task.status !== "Overdue") {
          task.status = "Overdue";
          await task.save();
        }
      }
    }

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
    });
  }
};

// 2. Get Single Task Details (For the Right Side Panel)
exports.getTaskDetails = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      internId: req.user._id 
    }).populate("mentorId", "name");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ 
      success: true, 
      task: {
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline,
        priority: task.priority,
        mentorName: task.mentorId.name,
        mentorAttachment: task.mentorAttachment, // File from mentor
        mentorFeedback: task.mentorFeedback,     // Latest feedback
        reviewHistory: task.reviewHistory,       // Full history for the panel timeline
        submissionVersions: task.submissionVersions // All previous work versions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching task details" });
  }
};

// 3. Submit Task (Even if Overdue)
exports.submitTask = async (req, res) => {
  try {
    const { submissionLink, submissionNotes } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      internId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // ❌ Prevent submit after approval
    if (task.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Task already approved. Cannot submit again.",
      });
    }

    // ❌ Prevent duplicate submission
    if (task.status === "Submitted" || task.status === "Under Review") {
      return res.status(400).json({
        success: false,
        message: "Already submitted. Wait for mentor review.",
      });
    }

    // ✅ Save previous version
    if (task.submissionLink || task.submissionNotes || task.submissionFile) {
      task.submissionVersions.push({
        submissionLink: task.submissionLink,
        submissionNotes: task.submissionNotes,
        submittedAt: new Date(),
      });
    }

    // ✅ Update new submission
    task.submissionLink = submissionLink;
    task.submissionNotes = submissionNotes;

    // ✅ Status update
    task.status = "Submitted";

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Submission failed",
    });
  }
};

// 4. Start Task (Update status from Pending to In Progress)
exports.startTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const internId = req.user._id;

    const task = await Task.findOne({ _id: taskId, internId: internId });

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: "Task not found" 
      });
    }

    // Business Logic: Task sirf tabhi start ho sakta hai jab wo 'Pending' state mein ho
    // Ya phir agar aap allow karna chahte hain ki 'Overdue' task ko bhi start kiya ja sake
    if (task.status !== "Pending" && task.status !== "Overdue") {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot start a task that is already ${task.status}` 
      });
    }

    task.status = "In Progress";
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task started successfully",
      task,
    });
  } catch (error) {
    console.error("Error starting task:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to start task" 
    });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const internId = req.user._id;

    const stats = await Task.aggregate([
      { $match: { internId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Stats error",
    });
  }
};