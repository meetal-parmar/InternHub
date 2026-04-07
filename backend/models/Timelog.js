const mongoose = require('mongoose');

const timelogSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    startTime: {
        type: String, 
        required: true
    },
    endTime: {
        type: String, 
        required: true
    },
    totalHours: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["CODING", "LEARNING", "MANAGEMENT"], 
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Timelog", timelogSchema);