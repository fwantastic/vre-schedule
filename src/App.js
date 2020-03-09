import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './HomePage';
import Footer from "./Footer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HomePage />
      </header>
      <Footer />
    </div>
  );
}

export default App;
