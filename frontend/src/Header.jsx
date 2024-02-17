// Code: Header.js
import React from 'react';
import logo from './simp.png';
import './header.css';

const Header = () => {
  // This function will be called when the login button is clicked
  const handleLoginClick = () => {
    // Here you would typically route to your login page or open a login modal
    console.log('Login button clicked');
  };

  return (
    <div className="top-bar">
      <div className="left-container-top">
      <img src={logo} alt="Simplicity Logo" className="logo" />
      <h3 className="title">Simplicity</h3>
      </div>
      <div className="right-container-top">
      <button onClick={handleLoginClick} className="login-button">Log In</button>
      </div>
    </div>
  );
};

export default Header;
