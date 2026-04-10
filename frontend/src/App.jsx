
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
import InternMaterials from './pages/InternPage/InternMaterials';
import LeavesPage  from './pages/LeavesPage';
import Sidebar from './components/Sidebar/Sidebar';
import ProtectedRoute from "./components/ProtectedRoute";
import InternTask from "./pages/InternPage/InternTask";
import MonthlySummary from "./pages/MentorMonthlySummaryPage";

const DashboardLayout = ({ children }) => (
  <div style={{ 
    display: 'flex', 
    minHeight: '100vh', 
    background: '#f1f3f6', // YAHAN COLOR FIX KAREIN
    overflowX: 'hidden' 
  }}>
    <Sidebar />
    <main style={{ 
      flex: 1, 
      marginLeft: '250px', 
      padding: '30px',
      background: '#f1f3f6' // MAIN CONTENT KA BACKGROUND BHI SAME RAKHEIN
    }}>
      {children}
    </main>
  </div>
);

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

        {/* --- NO SIDEBAR ROUTES (Public Pages) --- */}
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
        <Route path="/verify" element={<VerifyOtp/>}/>
        <Route path="/reset" element={<ResetPassword/>}/>

<Route path="/intern-dashboard" element={
          <ProtectedRoute allowedRole="INTERN">
            <DashboardLayout><InternTask/></DashboardLayout>
          </ProtectedRoute>
        }/>

        {/* <Route path="/task" element={
          <ProtectedRoute allowedRole="INTERN">
            <DashboardLayout><InternTask/></DashboardLayout>
          </ProtectedRoute>
        }/> */}

        <Route path="/timelog" element={
          <ProtectedRoute allowedRole="INTERN">
            <DashboardLayout><TimelogPage/></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/monthlySummary" element={
          <ProtectedRoute allowedRole="INTERN">
            <DashboardLayout><MonthlySummaryPage/></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/materials" element={
          <ProtectedRoute allowedRole="INTERN">
            <DashboardLayout><InternMaterials/></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/leaves" element={
          <ProtectedRoute allowedRole="INTERN">
            <DashboardLayout><LeavesPage/></DashboardLayout>
          </ProtectedRoute>
        }/>

        {/* ---------- COMMON ROUTE ---------- */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout><ProfilePage/></DashboardLayout>
          </ProtectedRoute>
        }/>

        {/* ---------- MENTOR ROUTES ---------- */}
        <Route path="/mentor-dashboard" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><MentorDashboard/></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/create-intern" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><CreateIntern/></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/interns" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><MyInternsPage /></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/intern/:id" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><InternDetails /></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/assign-task" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><AssignTask /></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/tasks" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><MentorTasks /></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/reviews" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><ReviewTasks /></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/monthlySummary" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><MonthlySummary /></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/materials/add" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><AddMaterial /></DashboardLayout>
          </ProtectedRoute>
        }/>

        <Route path="/mentor/materials" element={
          <ProtectedRoute allowedRole="MENTOR">
            <DashboardLayout><MentorMaterials /></DashboardLayout>
          </ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;