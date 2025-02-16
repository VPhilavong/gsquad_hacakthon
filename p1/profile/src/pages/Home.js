import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [jobMatches, setJobMatches] = useState([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [isJobVisible, setIsJobVisible] = useState(false); 

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "http://localhost:8000/get_jobs", 
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        });
        setJobMatches(response.data.job_matches);
        setIsJobVisible(true); 
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const matchJob = async (job_id) => {
    try {
      await axios({
        method: "POST",
        url: `http://localhost:8000/match_job?job_id=${job_id}`, 
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Handle next job button
  const nextJob = () => {
    if (currentJobIndex < jobMatches.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
      setIsJobVisible(false); 
      setTimeout(() => setIsJobVisible(true), 200);
    }
  };

  const nextJobAndLike = () => {
    const job_id = jobMatches[currentJobIndex].id;
    matchJob(job_id);
    if (currentJobIndex < jobMatches.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
      setIsJobVisible(false);
      setTimeout(() => setIsJobVisible(true), 200); 
    }
  };

  return (
    <div className='home'>
      {jobMatches.length === 0 ? (
        <p>Loading job listings...</p>
      ) : (
        <div className={`job-listing ${isJobVisible ? 'show' : ''}`}>
          <h3>{jobMatches[currentJobIndex].title}</h3>
          <p>{jobMatches[currentJobIndex].location} | Posted on: {jobMatches[currentJobIndex].date}</p>
          <button 
            className="job-link-button" 
            onClick={() => window.open(jobMatches[currentJobIndex].job_link, '_blank')}
          >
            View Job
          </button>
          
          {/* Navigation Buttons */}
          <div className="job-navigation">
            <button 
              className="nav-button" 
              onClick={nextJob} 
              disabled={currentJobIndex === 0}
            >
              ❌
            </button>
            <button 
              className="nav-button" 
              onClick={nextJobAndLike} 
              disabled={currentJobIndex === jobMatches.length - 1}
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
