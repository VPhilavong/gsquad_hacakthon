import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import InterviewAI from './pages/InterviewAI';
import Cookies from 'js-cookie'; // Import js-cookie
import React, { useEffect, useState } from 'react';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const cookieUserId = Cookies.get('user_id');
    setUserId(cookieUserId);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Optionally show a loading spinner or message
    return <div>Loading...</div>;
  }

  if (!userId) {
    // If user_id doesn't exist in cookies, redirect to login
    navigate('/login');
    return null; // Don't render the protected content
  }

  // If user_id exists, render the children (protected content)
  return children;
};

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login />} />
          <Route path='/interviewai' element={<InterviewAI />} /> 
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
