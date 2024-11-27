import React from 'react';
import './App.css';
import Header from './components/header.jsx';
import Hero from './components/hero.jsx';
import PreLoader from './components/PreLoader.jsx';
export default function App() {
  return (
    <>
      <PreLoader />
      <div>
        <Header />
        <Hero />
      </div>
    </>
  );
}