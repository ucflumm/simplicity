import React from 'react';
import { useSideNavState } from './hooks/useSideNavState';
import './WhiteContainer.css'; // Make sure to import your CSS file

const WhiteContainer = ({ children }) => {
  const { collapsed } = useSideNavState();

  const containerStyle = {
    marginLeft: collapsed ? '80px' : '200px', // Adjust sizes as needed
    transition: 'margin-left 0.5s ease',
    marginTop: '100px',
    // Other styles for your main container
  };
  return <div className="white-container" style={containerStyle}>{children}</div>;
};

export default WhiteContainer;
