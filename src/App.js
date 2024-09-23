import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Main from './Main'; // Import the Main component
import QuestionsManagement from './components/QuestionsManagement';
import ContactUs from './components/ContactUs';
import FAQ from './components/FAQ';
import ResultsPage from './components/ResultPage';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  // Persist login state after refresh
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    }
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userRole, userId]);

  const handleLogout = () => {
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <Navbar userRole={userRole} handleLogout={handleLogout} />
      <Routes>
        {/* Login Page */}
        <Route path="/" element={userRole ? <Navigate to={`/${userRole}`} /> : <Login setUserRole={setUserRole} setUserId={setUserId} />} />
        <Route path="/login" element={userRole === null ? <Login setUserRole={setUserRole} setUserId={setUserId} /> : <Navigate to="/" />} />


        <Route path="/result" element={<ResultsPage/>} />
        
        {/* Main Page (User-specific) */}
        <Route path="/main" element={userRole === 'user' ? <Main userId={userId} /> : <Navigate to="/" />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />

        {/* User Dashboard */}
        <Route path="/user" element={userRole === 'user' ? <UserDashboard userId={userId} /> : <Navigate to="/" />} />
        
        {/* FAQ */}
        <Route path="/faq" element={<FAQ/>} />
        
        {/* Contact Us */}
        <Route path="/contact" element={<ContactUs/>} />

        {/* Leaderboard (Accessible to all) */}
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/manage-questions" element={<QuestionsManagement/>} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
