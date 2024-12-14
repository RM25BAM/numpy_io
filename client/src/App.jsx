import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AuthForm from './pages/AuthForm';
import Dashboard from './pages/Dashboard';
import { initializeFirebase } from './firebase';
export default function App() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    async function initFirebase() {
      try {
        await initializeFirebase();
        console.log("Firebase initialized successfully!");
        setIsFirebaseReady(true);
      } catch (error) {
        console.error("Error initializing Firebase:", error.message);
      }
    }
    initFirebase();
  }, []);

  if (!isFirebaseReady) {
    //firebase old logix
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}


/* import React , { useState, useEffect }  from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AuthForm from './pages/AuthForm';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} />
      </Routes>
    </BrowserRouter>

  );
} */
/* const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); */