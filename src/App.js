import React from 'react';
import './App.css';
import HomePage from './HomePage';
import Footer from "./Footer";
import ReactGA from 'react-ga';

ReactGA.initialize('UA-115168467-3');
ReactGA.pageview(window.location.pathname + window.location.search);

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
