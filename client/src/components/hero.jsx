import React, { useEffect } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import './hero.css';
import '../App.css';
import Spline from '@splinetool/react-spline';
import LAZY from '../assets/lazy.mp3';
import useSound from 'use-sound';
const Hero = () => {
    const [play, { stop }] = useSound(LAZY, { loop: true });
    useEffect(() => {
        play();
    }, [play, stop]);

    return (
        <section className="hero">
            <Spline className="app-background" scene="https://prod.spline.design/gqqOp-dCOfuuES3D/scene.splinecode" />
            <div>
                <div className="text-container silkscreen-regular">
                    <h1 className='text'>
                        Welcome
                    </h1>
                    <h1 className='text'>
                        <ReactTypingEffect text={["NUMPY.IO!"]}
                            cursor=' '
                        />
                    </h1>
                </div>
            </div>
        </section >
    );
};

export default Hero;
