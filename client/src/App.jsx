import React from 'react';
import './App.css';
import Header from './components/header.jsx';
import Hero from './components/hero.jsx';
import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <div>
      <Spline className="app-background" scene="https://prod.spline.design/gqqOp-dCOfuuES3D/scene.splinecode" />
      <Header />
      <Hero />
    </div>
  );
}