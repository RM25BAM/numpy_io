import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import '../components/AuthForm.css';
import '../App.css';
import { initializeFirebase, getAuthInstance } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isSignUp = location.pathname === '/signup';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);

    useEffect(() => {
        async function initFirebase() {
            try {
                await initializeFirebase();
                setIsFirebaseReady(true);
            } catch (err) {
                console.error('Failed to initialize Firebase:', err);
                setError('Failed to initialize Firebase. Please try again later.');
            }
        }
        initFirebase();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isFirebaseReady) {
            setError('Firebase is not ready. Please wait and try again.');
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        try {
            const auth = getAuthInstance();
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('User signed up successfully');
                navigate('/signin');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                console.log('User signed in successfully');
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="app-background">
            <div className="form-container">
                <h2 className="silkscreen-regular">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isSignUp ? "Create your password" : "Password"}
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div className="input-group">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    <button className="btn" type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                </form>

                <p>
                    {isSignUp ? (
                        <span>
                            Already have an account? <a href="/signin">Sign in here</a>
                        </span>
                    ) : (
                        <span>
                            Don't have an account? <a href="/signup">Sign up here</a>
                        </span>
                    )}
                </p>
            </div>

            <div className="app-background">
                <Spline scene="https://prod.spline.design/bR9-6jrTvKSKM41g/scene.splinecode" />
            </div>
        </div>
    );
};

export default AuthForm;




/* import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import '../components/AuthForm.css';
import '../App.css';
import { auth } from './firebase';

const AuthForm = () => {
    const location = useLocation();
    const isSignUp = location.pathname === '/signup';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignUp && password !== confirmPassword) {
            console.log("Passwords don't match.");
            return;
        }

        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="app-background">
            <div className="form-container">
                <h2 className="silkscreen-regular">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isSignUp ? "Create your password" : "Password"}
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div className="input-group">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    <button className="btn" type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                </form>

                <p>
                    {isSignUp ? (
                        <span>
                            Already have an account? <a href="/signin">Sign in here</a>
                        </span>
                    ) : (
                        <span>
                            Don't have an account? <a href="/signup">Sign up here</a>
                        </span>
                    )}
                </p>
            </div>

            <div className="app-background">
                <Spline scene="https://prod.spline.design/S-Sa5CcCaXXPTkv3/scene.splinecode" />
            </div>
        </div>
    );
};

export default AuthForm;
 */