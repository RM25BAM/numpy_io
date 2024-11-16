import React from 'react';
import ReactTypingEffect from 'react-typing-effect';
import './hero.css';
import '../App.css';
import Spline from '@splinetool/react-spline';
const Hero = () => {
    return (
        <section className="hero">
            <Spline className="app-background" scene="https://prod.spline.design/gqqOp-dCOfuuES3D/scene.splinecode" />
            <div>
                <div className="text-container silkscreen-regular">
                    <h1 className='text'>
                        <ReactTypingEffect text={["HEY NUMPY"]}
                            cursor=' '
                        />
                    </h1>


                </div>
            </div>
        </section>
    );
};

export default Hero;
