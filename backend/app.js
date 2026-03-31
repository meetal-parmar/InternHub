require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/authRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const app = express();

const cors = require('cors');

mongoose.connect(process.env.MONGO_URL)
.then((res)=>{
    console.log("db connect")
})
.catch((err)=>{
    console.log(err);
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use('/auth', userRoutes);
app.use('/mentor', mentorRoutes);

const profileRoutes = require("./routes/ProfileRoutes");
app.use("/profile", profileRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`app is listening on port ${process.env.PORT}`);
})

