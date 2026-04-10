
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
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
import MentorTimelinePage  from "./pages/MentorPage/MentorTimelinePage";
import MentorLeavesPage from "./pages/MentorPage/MentorLeavesPage";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


const DashboardLayout = ({ children }) => (
  <div style={{ 
    display: 'flex', 
    minHeight: '100vh', 
    background: '#f1f3f6', 
    overflowX: 'hidden' 
  }}>
    {/* 1. Sidebar hamesha fixed rahega left mein */}
    <Sidebar /> 

    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      marginLeft: '250px', // Sidebar ki width jitni jagah chhodi
      transition: 'all 0.3s ease'
    }}>
      
      {/* 2. HEADER: Ab ye har dashboard page ke top par aayega */}
      <Header /> 

      {/* 3. MAIN CONTENT: Har page ka content yahan render hoga */}
      <main style={{ 
        flex: 1, 
        padding: '30px', 
        background: '#f1f3f6' 
      }}>
        {children}
      </main>
      <Footer />
    </div>
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

        {/* --- WITH SIDEBAR ROUTES (Dashboard Pages) --- */}
        {/* Intern Routes */}
        <Route path="/intern-dashboard" element={<DashboardLayout><InrenDashboard/></DashboardLayout>}/>
        <Route path='/timelog' element={<DashboardLayout><TimelogPage/></DashboardLayout>}/>
        <Route path="/monthlySummary" element={<DashboardLayout><MonthlySummaryPage /></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><ProfilePage /></DashboardLayout>} />

        {/* Mentor Routes */}
        <Route path="/mentor-dashboard" element={<DashboardLayout><MentorDashboard/></DashboardLayout>}/>
        <Route path="/create-intern" element={<DashboardLayout><CreateIntern/></DashboardLayout>}/>
        <Route path="/mentor/interns" element={<DashboardLayout><MyInternsPage /></DashboardLayout>} />   
        <Route path="/mentor/intern/:id" element={<DashboardLayout><InternDetails /></DashboardLayout>} /> 
        <Route path="/mentor/assign-task" element={<DashboardLayout><AssignTask /></DashboardLayout>} />
        <Route path="/mentor/tasks" element={<DashboardLayout><MentorTasks /></DashboardLayout>} />
        <Route path="/mentor/reviews" element={<DashboardLayout><ReviewTasks /></DashboardLayout>} />
        <Route path="/mentor/materials/add" element={<DashboardLayout><AddMaterial /></DashboardLayout>} />
        <Route path="/mentor/materials" element={<DashboardLayout><MentorMaterials /></DashboardLayout>} />
      <Route path="/mentor/timeline" element={<DashboardLayout><MentorTimelinePage  /></DashboardLayout>} />
     <Route path="/mentor/leaves" element={<DashboardLayout><MentorLeavesPage  /></DashboardLayout>} />
     

    
      </Routes>
    </BrowserRouter>
  );
}

export default App;