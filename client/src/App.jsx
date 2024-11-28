import React/* , { useState, useEffect } */ from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
/* const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); */