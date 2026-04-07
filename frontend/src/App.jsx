
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'react-hot-toast';
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
import TimelogPage from './pages/InternPage/TimeLogPage';
import MonthlySummaryPage from './pages/InternPage/MonthlySummaryPage';
import MyInternsPage from "./pages/MentorPage/MyInternsPage";
import InternDetails from "./pages/MentorPage/InternDetails";
import AssignTask from "./pages/MentorPage/AssignTask"; 
import MentorTasks from "./pages/MentorPage/MentorTasks";
import ReviewTasks from "./pages/MentorPage/ReviewTasks";
import AddMaterial from "./pages/MentorPage/AddMaterial";
import MentorMaterials from "./pages/MentorPage/MentorMaterials";



function App() {
  return (
    <BrowserRouter>
    <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{

          duration: 5000, // 5 seconds tak dikhega
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
          },
        }}
      />
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
        <Route path='/timelog' element={<TimelogPage/>}/>
        <Route path="/monthlySummary" element={<MonthlySummaryPage />} />
        <Route path = "/mentor/interns" element = { <MyInternsPage /> } />   
       <Route path="/mentor/intern/:id" element={<InternDetails />} /> 
       <Route path="/mentor/assign-task" element={<AssignTask />} />
       <Route path="/mentor/tasks" element={<MentorTasks />} />
       <Route path="/mentor/reviews" element={<ReviewTasks />} />
       <Route path="/mentor/materials/add" element={<AddMaterial />} />
       <Route path="/mentor/materials" element={<MentorMaterials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;