import React from 'react'
import Header from '../components/header.jsx';
import Hero from '../components/hero.jsx';
import PreLoader from '../components/PreLoader.jsx';

const home = () => {
    return (
        <>
            <PreLoader />
            <div>
                <Header />
                <Hero />
            </div>
        </>
    )
}

export default home;