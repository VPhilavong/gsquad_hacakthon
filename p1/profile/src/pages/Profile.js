import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests
import Cookies from "js-cookie"; // To handle cookies
import "./profile.css";

const ProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [summary, setSummary] = useState("Enter A Summary Here");
  const [education, setEducation] = useState("Enter Education Here");
  const [workExperience, setWorkExperience] = useState("Enter Work Experience Here");
  const [contactInfo, setContactInfo] = useState("Enter Contact Information Here");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null); // Initialize the profile photo URL state
  const [loading, setLoading] = useState(true); // Loading state to handle API call state
  const [error, setError] = useState(""); // Error state for handling failed API calls

  useEffect(() => {
    const userId = Cookies.get("user_id"); // Retrieve user_id from cookies

    if (!userId) {
      // If there's no user_id in cookies, redirect to login
      window.location.href = "/login"; // Redirect to login page
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "http://localhost:8000/user_profile", // Your endpoint
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        });
        // Set the profile data
        const userProfile = response.data.user_profile;
        setFirstName(userProfile.first_name);
        setLastName(userProfile.last_name);
        setJobTitle(userProfile.job_title);
        setProfilePhotoUrl(userProfile.profile_photo_url);
        setSummary(userProfile.summary || "Enter A Summary Here");
        setEducation(userProfile.education || "Enter Education Here");
        setWorkExperience(userProfile.work_experience || "Enter Work Experience Here");
        setContactInfo(userProfile.contact_info || "Enter Contact Information Here");

        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.log(err);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array to run the effect only once on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there's an issue fetching the profile
  }

  return (
    <div className="profile-page">
      <div className="main-container">

        {/* Profile Section */}
        <div className="profile-section">
          <img
            src={profilePhotoUrl || "https://via.placeholder.com/100"} // Use profile photo URL or default if null
            alt="Profile"
            className="profile-img"
          />
          <h2 className="profile-name">{`${firstName} ${lastName}`}</h2>
          <p className="profile-title">{jobTitle}</p>
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
