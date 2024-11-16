import React from 'react';
import './header.css';
import logo from '../assets/logo.gif'
import ReactTypingEffect from 'react-typing-effect';
function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <img src={logo} alt="logo" className="logo-icon" />
                </div>
            </div>
            <nav className="header-nav">
                <button className="btn">
                    <a href="#features" className="">Features</a>
                </button>
                <button className="btn">
                    <a href="#AboutUs" className="">About Us</a>
                </button>
                <button className="btn">
                    <a href="#Contact">Contact</a>
                </button>
            </nav>
            <div className="header-right">
                <button onClick className="signup">
                    <a href="#signup" className="signup_text">Sign up</a>
                </button>
                <button onClick className="signin">
                    <a href="#signin" className="signin_text">Sign in</a>
                </button>
            </div>
        </header>
    );
};

export default Header;

