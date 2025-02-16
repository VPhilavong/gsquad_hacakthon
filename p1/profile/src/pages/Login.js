
import './Login.css'
import { CiUser } from "react-icons/ci";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import React, { useState } from "react";

const Login = () => {

    const [action, setAction] = useState("Login");


    return (
        <div className="container">
            <div classname="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Login"?<div></div>: <div className="input">
                    <CiUser/>
                    <input type="text" placeholder="Name"/>
                </div>}
            </div>
            <div className="inputs">
                <div className="input">
                    <MdOutlineMailOutline/>
                    <input type="email" placeholder="Email"/>
                </div>
            </div>
            <div className="inputs">
                <div className="input">
                    <CiLock/>
                    <input type="password" placeholder="Password"/>
                </div>
            </div>
            {action==="Login"?<div></div>: <div> </div>}
            <div className="submit-container">
                <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>
    )
}

export default Login;