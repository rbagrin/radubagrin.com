import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [text, setText] = useState('AAA');
  const [tickerData, setTickerData] = useState(null);

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

  const fetchTicker = useCallback(async (ticker) => {
    try {
      const data = (await axios.get(`/api/stocks/${ticker}`)).data;
      setTickerData(data);
      console.log(data)
    } catch {
      setText("ERROR!");
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>{text}</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          In progress...
        </p>
      </header>
      <section>
       <button onClick={async () => {await fetchTicker('APPL')}}>Apple</button>
       <button onClick={async () => {await fetchTicker('IBM')}}>IBM</button>
       {tickerData && <div>
        {JSON.stringify(tickerData)}
       </div>}
      </section>
    </div>
  );
}

export default App;
