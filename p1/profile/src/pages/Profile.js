import React, { useState } from "react";

const Profile = () => {
  const [summary, setSummary] = useState("Enter A Summary Here");
  const [education, setEducation] = useState("Enter Education Here");
  const [workExperience, setWorkExperience] = useState("Enter Work Experience Here");
  const [contactInfo, setContactInfo] = useState("Enter Contact Information Here");

  return (
    <div className="min-h-screen bg-[#EAE7DC] flex flex-col p-4 md:p-8">
      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-6 mt-12 md:mt-16">

        {/* Profile Section */}
        <div className="bg-[#E98074] p-6 rounded-2xl shadow-lg w-full md:w-1/3 lg:w-1/4 flex flex-col items-center h-fit">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-full w-32 h-32 border-4 border-white shadow-md hover:scale-105 transition-transform"
          />
          <h2 className="text-2xl font-bold mt-6 text-gray-800">Jeff Bezos</h2>
          <p className="text-sm text-gray-700 mt-2">Executive Chairman of Amazon</p>
          <div className="w-full mt-6">
            <label className="block text-gray-800 font-medium mb-2">Summary</label>
            <textarea 
              className="bg-white/50 border-2 border-gray-300 rounded-xl p-3 text-sm w-full 
                focus:outline-none focus:border-[#D97C6F] focus:ring-1 focus:ring-[#D97C6F]
                hover:border-gray-400 transition-colors resize-none"
              rows="5"
              value={summary} 
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#E98074] p-6 rounded-2xl shadow-md text-white hover:shadow-xl transition-shadow cursor-pointer
            flex items-center justify-center min-h-[150px]">
            <button className="font-semibold text-lg hover:scale-105 transition-transform">
              + Attach Resume (pdf) Here
            </button>
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
  <div className="bg-[#E98074] p-6 rounded-2xl shadow-md text-white hover:shadow-xl transition-shadow">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <textarea
      className="bg-white/80 border-2 border-gray-200 rounded-xl p-3 text-sm w-full text-gray-800
        focus:outline-none focus:border-white focus:ring-1 focus:ring-white
        hover:border-gray-300 transition-colors resize-none"
      rows="6"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

<<<<<<< HEAD
export default ProfilePage;
=======
export default Profile;
>>>>>>> 70c1ad73bc49c06b1fe334ffbf2b040766bccba8
