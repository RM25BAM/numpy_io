import React from 'react';
import './App.css';
import Header from './components/header.jsx';
import Hero from './components/hero.jsx';
import Feature from './components/features.jsx';
import About from './components/about.jsx';
import Contact from './components/contact.jsx'

export default function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Feature />
      <About />
      <Contact />
    </div>
  );
}