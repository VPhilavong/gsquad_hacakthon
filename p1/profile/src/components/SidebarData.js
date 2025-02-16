import React from 'react';
import * as AiIcons from "react-icons/ai";
import { GiBrain } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import * as FaIcons from "react-icons/fa"

export const SidebarData = [
    {
      title: 'Home',
      path: '/',
      icon: <AiIcons.AiFillHome color='#E85A4F'  />,
      cName: 'nav-text'
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: <CgProfile color='#E85A4F'/>,
      cName: 'nav-text'
    },
    {
      title: 'Interview',
      path: '/interview',
      icon: <GiBrain color='#E85A4F'/>,
      cName: 'nav-text'
    },
    {
      title: 'Matches',
      path: '/matches',
      icon: <FaIcons.FaBriefcase />,
      cName: 'nav-text'
    }
    // {
    //   title: 'Logout',
    //   path: '/logout',
    //   icon: <IoIcons.IoMdPeople />,
    //   cName: 'nav-text'
    // },
    // {
    //   title: 'Messages',
    //   path: '/messages',
    //   icon: <FaIcons.FaEnvelopeOpenText />,
    //   cName: 'nav-text'
    // },
    // {
    //   title: 'Support',
    //   path: '/support',
    //   icon: <IoIcons.IoMdHelpCircle />,
    //   cName: 'nav-text'
    // }
  ];