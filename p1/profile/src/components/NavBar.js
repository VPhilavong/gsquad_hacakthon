import './NavBar.css';
import useAuth from "./useAuth";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IoIosLogOut } from "react-icons/io";
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';
import logo from '../assets/elevate-logo.png';

function NavBar() {

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const { handleLogout } = useAuth();

  return (
    <>
      <IconContext.Provider value={{ color: '#E98074' }}>
      
        <div className='navbar'>
          {/* Logo */}
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className='logo'>
            <img src={logo} alt='Logo' className='logo-img' />
          </div>
        </div>

      {/* Overlay (Dim background) */}
      {sidebar && <div className='overlay' onClick={showSidebar}></div>}

        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose color='#E85A4F'/>
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button className='logout-button' onClick={handleLogout}><IoIosLogOut color='#E85A4F'/><span>Logout</span></button>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default NavBar;