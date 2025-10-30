// src/App.jsx
import { useState } from 'react';
import Login from './login.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';

function App() {
  // Currently just login page
  const [page, setPage] = useState('login');

  console.log(page);

  if (page == 'login')
    return (
      <>
        <DatedList />
        <UndatedList />
        <Filterer />
        <div id="darkenBG"></div>
        <Login setPage={setPage} />
      </>
    );
  else if (page == 'main')
    return (
      <>
        <DatedList />
        <UndatedList />
        <Filterer />
      </>
    );
}

export default App;
