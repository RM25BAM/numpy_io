import React from 'react';
import Typewriter from './Typewriter.jsx';
import './hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="text-container">
                <h1>Welcome to Our Website</h1>
                <Typewriter text="This is Working Fine !!" speed={100} />
            </div>
        </section>
    );
};

export default Hero;
