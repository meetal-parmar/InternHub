
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import InrenDashboard from "./pages/InternPage/InternDashboard";
import CreateIntern from "./pages/CreateIntern";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import MentorDashboard from "./pages/MentorPage/MentorDashboard";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/intern-dashboard" element={<InrenDashboard/>}/>
        <Route path="/mentor-dashboard" element={<MentorDashboard/>}/>
        <Route path="/create-intern" element={<CreateIntern/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
        <Route path="/verify" element={<VerifyOtp/>}/>
        <Route path="/reset" element={<ResetPassword/>}/>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;