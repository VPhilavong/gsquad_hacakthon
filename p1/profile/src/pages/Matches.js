import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Matches.css";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios({
            method: "GET",
            url: "http://localhost:8000/get_job_matches", 
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          });
        setMatches(response.data.job_matches || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("No job matches.");
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="matches-page">
      <h2>Job Matches</h2>
      <ul className="matches-list">
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <li key={index} className="match-card">
              <h3>{match.title}</h3>
              <p>{match.company}</p>
              <a href={match.job_link} target="_blank" rel="noopener noreferrer">
                View Job
              </a>
            </li>
          ))
        ) : (
          <p>No job matches found.</p>
        )}
      </ul>
    </div>
  );
};

export default Matches;
