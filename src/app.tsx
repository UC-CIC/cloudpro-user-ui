import React, { useState, useEffect } from 'react';
import logo from './logo.svg';


export const App: React.FC = () => {
  const form_test = {
    "user_id":"test_user",
    "open_forms":"abc"
  }

  useEffect(() => {
    //init
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
};
