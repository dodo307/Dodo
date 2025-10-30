// src/App.jsx
import React from 'react';
import Login from './login.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';

function App() {
  // Currently just login page
  return (
    <>
	  <DatedList />
	  <UndatedList />
	  <Filterer />
	  <div id="darkenBG"></div>
      <Login />
    </>
  );
}

export default App;
