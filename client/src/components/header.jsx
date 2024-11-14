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
                <button>
                    <a href="#features">Features</a>
                </button>
                <button>
                    <a href="#AboutUs">About Us</a>
                </button>
                <button>
                    <a href="#Contact">Contact</a>
                </button>
            </nav>
            <div className="header-right">
                <button onClick className="signup">
                    <a href="#signup">Sign up</a>
                </button>
                <button onClick className="signin">
                    <a href="#signin">Sign in</a>
                </button>
            </div>
        </header>
    );
};

export default Header;

