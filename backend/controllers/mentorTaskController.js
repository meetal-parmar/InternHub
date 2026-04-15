
const Task = require("../models/Task");
const Notification = require("../models/Notification");
exports.createTask = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { internId, title, description, deadline, priority } = req.body;

    const taskData = {
      mentorId,
      internId,
      title,
      description,
      deadline,
      priority,
      status: "Pending",
    };

    if (req.file) {
      taskData.mentorAttachment = req.file.path;
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to assign task",
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ mentorId: req.user._id })
      .populate("internId", "name email")
      .sort({ createdAt: -1 });

    for (let task of tasks) {
      const today = new Date();
      const deadline = new Date(task.deadline);

      if (
        today > deadline &&
        ["Pending", "In Progress", "Submitted"].includes(task.status)
      ) {
        task.status = "Overdue";
        await task.save();
      }
    }

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.title = title;
    task.description = description;
    task.deadline = deadline;
    task.priority = priority;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

exports.getReviewQueue = async (req, res) => {
  try {
    const tasks = await Task.find({
      mentorId: req.user._id,
      status: { $in: ["Submitted", "Under Review"] },
    })
      .populate("internId", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review queue",
    });
  }
};

exports.reviewTask = async (req, res) => {
  try {
    const { feedback, decision, supportLink } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = decision;
    task.mentorFeedback = feedback;

    task.reviewHistory.push({
      feedback,
      decision,
      supportLink,
      supportFile: req.file ? req.file.path : "",
    });

    await task.save();

     await Notification.findOneAndDelete({
      relatedId: task._id,
      type: "task_submitted",
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Task reviewed successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to review task",
    });
  }
};