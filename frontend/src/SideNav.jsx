// This is the side navigation bar that will be displayed on the left side of the screen.
import { useSideNavState } from './hooks/useSideNavState';
import React, { useState } from 'react';
import './SideNav.css';
import { Box } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const NavItem = ({ icon, text, link, collapsed }) => {
  return (
    // <Box className={`nav-item ${collapsed ? 'collapsed' : ''}`}>
    //   {icon}
    //   <Link to={link} className={`nav-text ${collapsed ? 'hidden' : ''}`}>{text}</Link>
    // </Box>
    <Link to={link} className={`nav-item ${collapsed ? 'collapsed' : ''}`}>
    <Box className="icon">{icon}</Box>
    <span className={`nav-text ${collapsed ? 'hidden' : ''}`}>{text}</span>
  </Link>
  );
}


function SideNav() {
  // Use the custom hook to get the collapsed state and the setter function
  const { collapsed, setCollapsed } = useSideNavState();

  const toggleNav = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidenav ${collapsed ? 'collapsed' : ''}`}>
      <NavItem icon={<HomeIcon sx={{ color: 'white', fontSize: '30px' }} />} text="Item Library" link="/" collapsed={collapsed} />
      {/* <NavItem icon={<FolderCopyIcon sx={{ color: 'white' }} />} text="Item Library" link="/item-library" collapsed={collapsed} /> */}
      <NavItem icon={<AddBoxIcon sx={{ color: 'white' }} />} text="Create Item" link="/create-item" collapsed={collapsed} />
      <NavItem icon={<LocalGroceryStoreIcon sx={{ color: 'white' }} />} text="Adjustments" link="/adjustments" collapsed={collapsed} />
      <Box className="toggle-btn" onClick={toggleNav}>
        <MenuIcon sx={{ color: 'white', fontSize: '30px' }} />
      </Box>
    </div>
  );
}

export default SideNav;

