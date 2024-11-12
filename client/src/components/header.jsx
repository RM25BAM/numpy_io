import React from 'react';
import './header.css';
import logo from '../assets/logo.gif'
function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <img src={logo} alt="logo" className="logo-icon" />
                </div>
            </div>
            <nav className="header-nav">
                <a href="#features">Features</a>
                <a href="#AboutUs">About Us</a>
                <a href="#Contact">Contact</a>
            </nav>
            <div className="header-right">
                <button onClick></button>
                <a href="#signup" className="signup">Sign up</a>
                <a href="#signin" className="signin">Sign in</a>
            </div>
        </header>
    );
};

export default Header;

