const Timelog = require("../models/Timelog");
const mongoose = require("mongoose");

exports.getMonthlyAnalysisByMentor = async (req, res) => {
    try {
        const { month, year } = req.query;
        const { internId } = req.params;

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
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};