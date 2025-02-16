import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Interview from './pages/interview';
import Matches from './pages/Matches'; // Import MatchesPage
import Cookies from 'js-cookie'; // Import js-cookie
import React, { useEffect, useState } from 'react';
import InterviewAI from './pages/InterviewAI';

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
    return <div>Loading...</div>;
  }

  if (!userId) {
    navigate('/login');
    return null;
  }

  return children;
};

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><InterviewAI/></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches/></ProtectedRoute>} /> {/* New Route */}
          <Route path="/login" element={<Login />} />
          <Route path='/' exact element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login />} />
          <Route path='/interviewai' element={<InterviewAI />} /> 
        </Routes>
      </Router>
    </>
  );
}

export default App;
