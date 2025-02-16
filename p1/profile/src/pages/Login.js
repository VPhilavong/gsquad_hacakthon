import './Login.css';
import { CiUser } from "react-icons/ci";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from 'js-cookie'; // Import js-cookie

const Login = () => {
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLogin = async () => {
        try {
            const response = await axios({
                method: "POST",
                url: "http://localhost:8000/login",
                headers: { "Content-Type": "application/json" },
                data: { email, password }
            });
            console.log("Login successful", response.data);

            // Save user_id to cookies
            const userId = response.data.session?.user?.id;
            const accessToken = response.data.session?.access_token;
            if (userId) {
                Cookies.set('user_id', userId, { expires: 7 }); // Save user_id with a 7-day expiration
                Cookies.set('access_token', accessToken, {expires: 2});
            }

            // Redirect to homepage after successful login
            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios({
                method: "POST",
                url: "http://localhost:8000/signup",
                headers: { "Content-Type": "application/json" },
                data: { 
                    email, 
                    password, 
                    first_name: firstName, 
                    last_name: lastName, 
                    job_title: jobTitle, 
                    phone_number: phoneNumber, 
                    role 
                }
            });
            console.log("Sign Up successful", response.data);
            
            // Save user_id to cookies
            const userId = response.data.profile?.user_id || response.data.user?.id;
            if (userId) {
                Cookies.set('user_id', userId, { expires: 7 }); // Save user_id with a 7-day expiration
            }

            // Redirect to homepage after successful sign-up
            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "Sign Up failed");
        }
    };

      const handleLogout = () => {
        Cookies.remove('user_id'); // Remove user_id cookie
        Cookies.remove('access_token'); // Remove access_token cookie
        navigate("/login"); // Redirect to login page
      };

    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            {/* Move the Login and Sign Up buttons to the top */}
            <div className="submit-container">
                <button 
                    className={action === "Login" ? "submit gray" : "submit"} 
                    onClick={() => setAction("Sign Up")}
                >
                    Sign Up
                </button>
                <button 
                    className={action === "Sign Up" ? "submit gray" : "submit"} 
                    onClick={() => setAction("Login")}
                >
                    Login
                </button>
            </div>

            {/* Input fields */}
            <div className="inputs">
                <div className="input">
                    <MdOutlineMailOutline color="#fff" className="icon"/>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
            </div>
            <div className="inputs">
                <div className="input">
                    <CiLock color="#fff" className="icon"/>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
            </div>

            {action === "Sign Up" && (
                <div className="inputs">
                    <div className="input">
                        <CiUser color="#fff" className="icon"/>
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                        />
                    </div>
                    <div className="input">
                        <CiUser color="#fff" className="icon"/>
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                        />
                    </div>
                    <div className="input">
                        <CiUser color="#fff" className="icon"/>
                        <input 
                            type="text" 
                            placeholder="Job Title" 
                            value={jobTitle} 
                            onChange={(e) => setJobTitle(e.target.value)} 
                        />
                    </div>
                    <div className="input">
                        <CiUser color="#fff" className="icon"/>
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                        />
                    </div>
                    <div className="input">
                        <CiUser color="#fff" className="icon"/>
                        <input 
                            type="text" 
                            placeholder="Role" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                        />
                    </div>
                </div>
            )}
            
            {error && <div className="error">{error}</div>}

            {/* Submit Button */}
            
            {action === "Login" && (
                <div className="submit-container2">
                    <button className="submit" onClick={handleLogin}>
                        Submit
                    </button>
                </div>
            )}
            {action === "Sign Up" && (
                <div className="submit-container2">
                    <button className="submit" onClick={handleSignup}>
                        Register
                    </button>
                </div>
            )}
        </div>
    );
};

export default Login;
