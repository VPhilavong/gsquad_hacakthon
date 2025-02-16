import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isMatchVisible, setIsMatchVisible] = useState(false); 
  const [roleId, setRoleId] = useState(null); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "http://localhost:8000/user_profile", 
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        });
        const userProfile = response.data.user_profile;
        setRoleId(userProfile.role_id);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (roleId === 2) {
          // Fetch applicants for role_id 2
          const response = await axios({
            method: "GET",
            url: "http://localhost:8000/get_applicants", 
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          });
          setMatches(response.data.job_matches);
        } else {
          // Fetch jobs for other roles
          const response = await axios({
            method: "GET",
            url: "http://localhost:8000/get_jobs", 
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          });
          setMatches(response.data.job_matches);
        }
        setIsMatchVisible(true); 
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    if (roleId !== null) {
      fetchMatches();
    }
  }, [roleId]);

  const matchJob = async (match_id) => {
    try {
      await axios({
        method: "POST",
        url: `http://localhost:8000/match_job?job_id=${match_id}`, 
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
    } catch (error) {
      console.error("Error matching job:", error);
    }
  };

  const matchJobRecruiter = async (applicant_id, job_id) => {
    try {
      await axios({
        method: "POST",
        url: `http://localhost:8000/match_job_recruiter?applicant_id=${applicant_id}&job_id=${job_id}`, 
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      console.log("Job match successfully created between recruiter and applicant");
    } catch (error) {
      console.error("Error matching job with recruiter:", error);
    }
  };

  const nextMatch = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      setIsMatchVisible(false); 
      setTimeout(() => setIsMatchVisible(true), 200);
    }
  };

  const nextMatchAndLike = () => {
    const currentMatch = matches[currentMatchIndex];
  
    console.log("Current Match:", currentMatch); // Debugging
  
    if (!currentMatch) {
      console.error("Error: currentMatch is undefined.");
      return;
    }
  
    const job_id = currentMatch?.job_id;
    const user_id = currentMatch?.user_id;
  
    if (!job_id) {
      console.error("Error: job_id is undefined.");
    }
    if (!user_id && roleId === 2) {
      console.error("Error: user_id is undefined for recruiter.");
    }
  
    if (roleId === 2) {
      matchJobRecruiter(user_id, job_id);
    } else {
      matchJob(job_id);
    }
  
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      setIsMatchVisible(false);
      setTimeout(() => setIsMatchVisible(true), 200);
    }
  };
  

  return (
    <div className='home'>
      {matches.length === 0 ? (
        <p>Loading matches...</p>
      ) : (
        <div className={`match-listing ${isMatchVisible ? 'show' : ''}`}>
          {roleId === 2 ? (
            <div>
              <h3>{matches[currentMatchIndex].title}</h3>
              <p>{matches[currentMatchIndex].first_name} {matches[currentMatchIndex].last_name}</p>
              <p>{matches[currentMatchIndex].education}</p>
              <p>{matches[currentMatchIndex].summary}</p>
            </div>
          ) : (
            <div>
              <h3>{matches[currentMatchIndex].title}</h3>
              <p>{matches[currentMatchIndex].location} | Posted on: {matches[currentMatchIndex].date}</p>
              <button 
                className="job-link-button" 
                onClick={() => window.open(matches[currentMatchIndex].job_link, '_blank')}
              >
                View Job
              </button>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="match-navigation">
            <button 
              className="nav-button" 
              onClick={nextMatch} 
              disabled={currentMatchIndex === 0}
            >
              ❌
            </button>
            <button 
              className="nav-button" 
              onClick={nextMatchAndLike} 
              disabled={currentMatchIndex === matches.length - 1}
            >
              ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
