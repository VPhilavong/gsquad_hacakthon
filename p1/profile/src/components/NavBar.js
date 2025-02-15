import React, {useState} from 'react';
import * as FaIcons from "react-icons/fa6";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
      <div>
        <Link to="#" className='menu-bars'>
          <FaIcons.FaBars onClick={showSidebar}/>
        </Link>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nave-menu'}></nav>
        <ul className='nav-menu-items'>
          <li className='navbar-toggle'>
            <Link to='#' className='menu-bars'>
              <AiIcons.AiOutlineClose/>
            </Link>
          </li>
        </ul>
    </>
  );
}

export default NavBar;