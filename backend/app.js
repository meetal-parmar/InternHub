
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/authRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const mentorTaskRoutes = require("./routes/mentorTaskRoutes");
const materialRoutes = require("./routes/materialRoutes");
const internRoutes = require("./routes/internRoutes");
const internMaterialsRoutes = require('./routes/internMeterialRoutes');
const internTaskRoutes = require("./routes/internTaskRoutes");
const mentorMonthlyRoutes = require("./routes/mentorMonthlyRoutes");


const app = express();

// MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads")); // serve uploaded files

app.use('/intern',internRoutes);

const profileRoutes = require("./routes/ProfileRoutes");
// Routes
app.use("/auth", userRoutes);
app.use("/mentor", mentorRoutes);
app.use("/mentor", mentorTaskRoutes);
app.use("/profile", profileRoutes);
app.use("/mentor", materialRoutes);
app.use("/materials",internMaterialsRoutes);
app.use("/leaves", require("./routes/leaveRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));
app.use('/uploads', express.static('uploads'));
app.use("/", internTaskRoutes);
app.use("/",mentorMonthlyRoutes);
app.use("/api/mentor-dashboard", require("./routes/mentorDashboardRoutes"));
//app.use("/leaves", require("./routes/leaveRoutes"));
// app.use("/leaves", require("./routes/leaveRoutes"));

// Start server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));