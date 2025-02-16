import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './NavBar.css';
import { IconContext } from 'react-icons';
import useAuth from "./useAuth";
import logo from '../assets/elevate-logo.png';

function NavBar() {

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const { handleLogout } = useAuth();

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
      
        <div className='navbar'>
          {/* Logo */}
          <div className='logo'>
            <img src={logo} alt='Logo' className='logo-img' />
          </div>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>

        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
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
              <button className='logout-button' onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default NavBar;