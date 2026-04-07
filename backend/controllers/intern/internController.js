
// const Timelog = require("../../models/Timelog");

// exports.createTimelog = async (req, res) => {
//   try {
//     let { workDate, startTime, endTime, category, description } = req.body;

//     const parseTime = (timeStr) => {
//       const [time, modifier] = timeStr.split(" ");
//       let [hours, minutes] = time.split(":");
//       hours = parseInt(hours);
//       minutes = parseInt(minutes);

//       if (modifier === "PM" && hours !== 12) hours += 12;
//       if (modifier === "AM" && hours === 12) hours = 0;

//       // Sorting ke liye decimal value (e.g., 9:30 AM -> 9.5, 4:00 PM -> 16.0)
//       const decimalValue = hours + (minutes / 60);

//       const d = new Date(2026, 0, 1);
//       d.setHours(hours, minutes, 0, 0);
//       return { dateObj: d, decimalValue };
//     };

//     const startInfo = parseTime(startTime);
//     const endInfo = parseTime(endTime);

//     if (endInfo.dateObj <= startInfo.dateObj) {
//       return res.status(400).json({ 
//         message: "End time must be after start time." 
//       });
//     }

//     const diffInMs = endInfo.dateObj - startInfo.dateObj;
//     const currentLogHours = parseFloat((diffInMs / (1000 * 60 * 60)).toFixed(2));

//     const newLog = new Timelog({
//       internId: req.user._id,
//       workDate: new Date(workDate),
//       startTime,
//       endTime,
//       startDecimal: startInfo.decimalValue, // ✅ Sorting ke liye nayi field
//       totalHours: currentLogHours,
//       category: category.toUpperCase(),
//       description
//     });

//     await newLog.save();

//     // Summary calculation... (same as before)
//     const startDay = new Date(workDate);
//     startDay.setHours(0, 0, 0, 0);
//     const endDay = new Date(workDate);
//     endDay.setHours(23, 59, 59, 999);

//     const daySummary = await Timelog.aggregate([
//       { $match: { internId: req.user._id, workDate: { $gte: startDay, $lte: endDay } } },
//       { $group: { _id: null, totalDayHours: { $sum: "$totalHours" } } }
//     ]);

//     res.status(201).json({
//       message: "Timelog added successfully",
//       data: newLog,
//       dayTotalHours: daySummary.length > 0 ? daySummary[0].totalDayHours.toFixed(2) : "0.00"
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// exports.getTimelogs = async (req, res) => {
//   try {
//     let { date } = req.query;
//     const startDay = new Date(date);
//     startDay.setHours(0, 0, 0, 0);
//     const endDay = new Date(date);
//     endDay.setHours(23, 59, 59, 999);

//     // ✅ FIXED: startDecimal ke hisaab se sort karein
//     const logs = await Timelog.find({
//       internId: req.user._id,
//       workDate: { $gte: startDay, $lte: endDay }
//     }).sort({ startDecimal: 1 }); 

//     const totalHours = logs.reduce((sum, log) => sum + log.totalHours, 0);

//     res.status(200).json({
//       success: true,
//       totalHours: totalHours.toFixed(2),
//       data: logs
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };
// const Timelog = require("../../models/Timelog");

// exports.createTimelog = async (req, res) => {
//   try {
//     let { workDate, startTime, endTime, category, description } = req.body;

//     const parseTime = (timeStr) => {
//       const [time, modifier] = timeStr.split(" ");
//       let [hours, minutes] = time.split(":");
//       hours = parseInt(hours);
//       minutes = parseInt(minutes);

//       if (modifier === "PM" && hours !== 12) hours += 12;
//       if (modifier === "AM" && hours === 12) hours = 0;

//       const decimalValue = hours + (minutes / 60);
//       const d = new Date(2026, 0, 1);
//       d.setHours(hours, minutes, 0, 0);
//       return { dateObj: d, decimalValue };
//     };

//     const startInfo = parseTime(startTime);
//     const endInfo = parseTime(endTime);

//     if (endInfo.dateObj <= startInfo.dateObj) {
//       return res.status(400).json({ message: "End time must be after start time." });
//     }

//     // ✅ FIX 1: OVERLAP CHECK (Same time par record add nahi hoga)
//     const existingLogs = await Timelog.find({
//       internId: req.user._id,
//       workDate: new Date(workDate)
//     });

//     const isOverlapping = existingLogs.some(log => {
//       const logStart = log.startDecimal;
//       const logEnd = logStart + log.totalHours;
//       return (startInfo.decimalValue < logEnd && endInfo.decimalValue > logStart);
//     });

//     if (isOverlapping) {
//       return res.status(400).json({ message: "This time slot overlaps with an existing record!" });
//     }

//     const diffInMs = endInfo.dateObj - startInfo.dateObj;
//     const currentLogHours = parseFloat((diffInMs / (1000 * 60 * 60)).toFixed(2));

//     const newLog = new Timelog({
//       internId: req.user._id,
//       workDate: new Date(workDate),
//       startTime,
//       endTime,
//       startDecimal: startInfo.decimalValue, 
//       totalHours: currentLogHours,
//       category: category.toUpperCase(),
//       description
//     });

//     await newLog.save();

//     res.status(201).json({ message: "Timelog added successfully", data: newLog });

//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };
const Timelog = require("../../models/Timelog");
const mongoose = require("mongoose");

// Helper: Time string ko minutes mein convert karne ke liye
const getMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

exports.createTimelog = async (req, res) => {
  try {
    let { workDate, startTime, endTime, category, description } = req.body;

    const startMins = getMinutes(startTime);
    const endMins = getMinutes(endTime);

    // 1. Basic Validation
    if (endMins <= startMins) {
      return res.status(400).json({ message: "End time must be after start time." });
    }

    // 2. Overlap Check (Same time entry block)
    const existingLogs = await Timelog.find({
      internId: req.user._id,
      workDate: new Date(workDate)
    });

    const isOverlapping = existingLogs.some(log => {
      const eStart = getMinutes(log.startTime);
      const eEnd = getMinutes(log.endTime);
      return (startMins < eEnd && endMins > eStart);
    });

    if (isOverlapping) {
      return res.status(400).json({ message: "Time conflict" });
    }

    const totalHours = parseFloat(((endMins - startMins) / 60).toFixed(2));

    const newLog = new Timelog({
      internId: req.user._id,
      workDate: new Date(workDate),
      startTime,
      endTime,
      startDecimal: startMins, // For DB Level Sorting
      totalHours,
      category: category.toUpperCase(),
      description
    });

    await newLog.save();
    res.status(201).json({ message: "Timelog added successfully", data: newLog });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getTimelogs = async (req, res) => {
  try {
    let { date } = req.query;
    const startDay = new Date(date);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(date);
    endDay.setHours(23, 59, 59, 999);

    // Database level sorting (AM hamesha upar aayega)
    const logs = await Timelog.find({
      internId: req.user._id,
      workDate: { $gte: startDay, $lte: endDay }
    }).sort({ startDecimal: 1 }); 

    const totalHours = logs.reduce((sum, log) => sum + log.totalHours, 0);

    res.status(200).json({ success: true, totalHours: totalHours.toFixed(2), data: logs });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateTimelog = async (req, res) => {
    const { id } = req.params; 
    const { startTime, endTime, category, description, date } = req.body;

    try {
        const updatedLog = await Timelog.findByIdAndUpdate(
            id,
            {
                startTime,
                endTime,
                category,
                description,
                date
            },
            { new: true, runValidators: true } 
        );

        if (!updatedLog) {
            return res.status(404).json({
                success: false,
                message: "Timelog entry not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "TimeLog updated",
            data: updatedLog
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({
            success: false,
            message: "somthing wrong",
            error: error.message
        });
    }
};

exports.deleteTimelog = async (req, res) => {
    const { id } = req.params;

    try {
        const log = await Timelog.findOneAndDelete({
            _id: id,
            internId: req.user._id 
        });

        if (!log) {
            return res.status(404).json({
                success: false,
                message: "Log entry not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "TimeLog entry deleted successfully"
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({
            success: false,
            message: "Could not delete entry",
            error: error.message
        });
    }
};

// exports.getMonthlyAnalysis = async (req, res) => {
//     try {
//         const { month, year } = req.query;
//         const internId = req.user._id; // Auth middleware se user ID

//         // Mahine ki start aur end date calculate karein
//         const startDate = new Date(year, month - 1, 1);
//         const endDate = new Date(year, month, 0, 23, 59, 59);

//         // --- Aggregation Pipeline ---
//         const stats = await Timelog.aggregate([
//             {
//                 $match: {
//                     userId: new mongoose.Types.ObjectId(internId),
//                     workDate: { $gte: startDate, $lte: endDate }
//                 }
//             },
//             {
//                 $facet: {
//                     // Part A: Category wise hours (Pie Chart ke liye)
//                     "categoryBreakup": [
//                         {
//                             $group: {
//                                 _id: "$category",
//                                 totalHours: { $sum: { $toDouble: "$totalHours" } }
//                             }
//                         },
//                         { $project: { name: "$_id", totalHours: 1, _id: 0 } }
//                     ],
//                     // Part B: Overall Stats (KPIs ke liye)
//                     "overallStats": [
//                         {
//                             $group: {
//                                 _id: null,
//                                 totalHours: { $sum: { $toDouble: "$totalHours" } },
//                                 daysWorked: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$workDate" } } }
//                             }
//                         }
//                     ],
//                     // Part C: Daily logs for Calendar
//                     "dailyLogs": [
//                         {
//                             $group: {
//                                 _id: { $dateToString: { format: "%Y-%m-%d", date: "$workDate" } },
//                                 dayTotal: { $sum: { $toDouble: "$totalHours" } }
//                             }
//                         }
//                     ]
//                 }
//             }
//         ]);

//         // Data clean up for Response
//         const breakup = stats[0].categoryBreakup;
//         const overall = stats[0].overallStats[0] || { totalHours: 0, daysWorked: [] };
//         const daily = stats[0].dailyLogs;

//         // Most active category nikaalne ka logic
//         const mostActive = breakup.length > 0 
//             ? breakup.reduce((prev, current) => (prev.totalHours > current.totalHours) ? prev : current).name 
//             : "N/A";

//         res.status(200).json({
//             success: true,
//             data: {
//                 totalHours: overall.totalHours.toFixed(2),
//                 daysWorked: overall.daysWorked.length,
//                 avgDailyHours: overall.daysWorked.length > 0 
//                     ? (overall.totalHours / overall.daysWorked.length).toFixed(2) 
//                     : 0,
//                 mostActiveCategory: mostActive,
//                 categoryBreakup: breakup,
//                 logs: daily // Calendar mein dates highlight karne ke liye
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server Error in Analysis" });
//     }
// };

exports.getMonthlyAnalysis = async (req, res) => {
    try {
        const { month, year } = req.query;
        const internId = req.user._id;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const stats = await Timelog.aggregate([
            {
                $match: {
                    internId: new mongoose.Types.ObjectId(internId),
                    workDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $facet: {
                    categoryBreakup: [
                        {
                            $group: {
                                _id: "$category",
                                totalHours: { $sum: "$totalHours" }
                            }
                        },
                        {
                            $project: {
                                name: "$_id",
                                totalHours: 1,
                                _id: 0
                            }
                        }
                    ],

                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                totalHours: { $sum: "$totalHours" },
                                daysWorked: {
                                    $addToSet: {
                                        $dateToString: {
                                            format: "%Y-%m-%d",
                                            date: "$workDate"
                                        }
                                    }
                                }
                            }
                        }
                    ],

                    dailyLogs: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$workDate"
                                    }
                                },
                                dayTotal: { $sum: "$totalHours" }
                            }
                        }
                    ]
                }
            }
        ]);

        const breakup = stats[0].categoryBreakup;
        const overall = stats[0].overallStats[0] || { totalHours: 0, daysWorked: [] };
        const daily = stats[0].dailyLogs;

        const mostActive = breakup.length
            ? breakup.reduce((a, b) => (a.totalHours > b.totalHours ? a : b)).name
            : "N/A";

        res.json({
            success: true,
            data: {
                totalHours: overall.totalHours.toFixed(2),
                daysWorked: overall.daysWorked.length,
                avgDailyHours:
                    overall.daysWorked.length > 0
                        ? (overall.totalHours / overall.daysWorked.length).toFixed(2)
                        : 0,
                mostActiveCategory: mostActive,
                categoryBreakup: breakup,
                logs: daily
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};