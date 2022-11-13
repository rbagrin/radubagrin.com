import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [text, setText] = useState('AAA');

  useEffect(() => {
    (async () => {
      try {
        const text = (await axios.get('/api')).data;
        setText(text);
      } catch {
        setText("ERROR!");
      }
    })();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>{text}</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
