import React, { useEffect } from 'react'
import { preLoaderAnim } from "../animation";
import "./PreLoader.css";
const PreLoader = () => {
    useEffect(() => {
        console.log("Preloader animation triggered");
        preLoaderAnim();
    }, []);
    return (
        <div className="preloader">
            <div className="texts-container">
                <span>numerical Computation</span>
            </div>
        </div>
    );
}

export default PreLoader