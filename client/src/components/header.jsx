import React from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';
function Header() {
    const navigate = useNavigate();
    const SignIn = () => {
        navigate('/signin');
    }
    const SignUp = () => {
        navigate('/signup');
    }
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    {/*  <img src={logo} alt="logo" className="logo-icon" /> */}
                </div>
            </div>
            <nav className="header-nav">
                {/*                 <button className="btn">
                    <a href="#features" className="">Features</a>
                </button>
                <button className="btn">
                    <a href="#AboutUs" className="">About Us</a>
                </button>
                <button className="btn">
                    <a href="#Contact">Contact</a>
                </button> */}
            </nav>
            <div className="header-right">
                <button onClick={SignIn} className="signin signin_text" >
                    {/* <a href="#signin" className="signin_text"> */}Sign in
                </button>
                <button onClick={SignUp} className="signup signup_text">
                    {/* <a href="#signup" className="signup_text"> */}Sign up
                </button>
            </div>
        </header>

    );
};

export default Header;
