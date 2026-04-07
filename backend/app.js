
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/authRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const profileRoutes = require("./routes/ProfileRoutes");
const mentorTaskRoutes = require("./routes/mentorTaskRoutes");
const materialRoutes = require("./routes/materialRoutes");

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

// Routes
app.use("/auth", userRoutes);
app.use("/mentor", mentorRoutes);
app.use("/mentor", mentorTaskRoutes);
app.use("/profile", profileRoutes);
app.use("/mentor", materialRoutes);

// Start server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));