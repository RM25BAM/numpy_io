import React from 'react';
import './header.css';
import logo from '../assets/logo.png'
function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <img src={logo} alt="Postcrafts logo" className="logo-icon" />
                    <span className="logo-text">NUMPY IO</span>
                </div>
            </div>
            <nav className="header-nav">
                <a href="#features">Features</a>
                <a href="#AboutUs">About Us</a>
                <a href="#Contact">Contact</a>
            </nav>
            <div className="header-right">
                <a href="#signup" className="signup">Sign up</a>
                <a href="#signin" className="signin">Sign in</a>
            </div>
        </header>
    );
};

export default Header;

