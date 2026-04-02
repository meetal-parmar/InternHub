<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProfileMentor from "./pages/profile/ProfileMentor";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateIntern from "./pages/CreateIntern";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/profile/ProfilePage";
>>>>>>> 2120c6e2df47e22c5254938c5812ca44aa0ff1e8

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/create-intern" element={<CreateIntern/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
        <Route path="/verify" element={<VerifyOtp/>}/>
        <Route path="/reset" element={<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  )
=======
        <Route path="/" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> 2120c6e2df47e22c5254938c5812ca44aa0ff1e8
}

export default App;