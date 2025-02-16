import React, { useState } from "react";
import "./profile.css";

const ProfilePage = () => {
  const [summary, setSummary] = useState("Enter A Summary Here");
  const [education, setEducation] = useState("Enter Education Here");
  const [workExperience, setWorkExperience] = useState("Enter Work Experience Here");
  const [contactInfo, setContactInfo] = useState("Enter Contact Information Here");

  return (
    <div className="profile-page">
      <div className="main-container">
        
        {/* Profile Section */}
        <div className="profile-section">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="profile-img"
          />
          <h2 className="profile-name">Jeff Bezos</h2>
          <p className="profile-title">Executive Chairman of Amazon</p>
          <div className="input-container">
            <label className="input-label">Summary</label>
            <textarea
              className="input-textarea"
              rows="5"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="attach-resume">
            <button className="attach-button">+ Attach Resume (pdf) Here</button>
          </div>

          <SectionCard title="Education" value={education} onChange={setEducation} />
          <SectionCard title="Work Experience" value={workExperience} onChange={setWorkExperience} />
          <SectionCard title="Contact Information" value={contactInfo} onChange={setContactInfo} />
        </div>
      </div>
    </div>
  );
};

// Reusable section component
const SectionCard = ({ title, value, onChange }) => (
  <div className="section-card">
    <h3 className="section-title">{title}</h3>
    <textarea
      className="section-textarea"
      rows="6"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default ProfilePage;
