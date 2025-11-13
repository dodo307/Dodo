// src/App.jsx
import { useState } from 'react';
import Login from './login.jsx';
import ForgotPassword from './forgotPassword.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';
import AccountCircle from './assets/account_circle.svg';
import SettingsGear from './assets/settings_gear.svg';

function App() {
  // Currently just login page
  const [page, setPage] = useState('login');

  function viewAccount() {
    console.log('View Account Here Please');
  }

  function viewSettings() {
    console.log('View Settings Hear Please');
  }

  if (page == 'login')
    return (
      <>
        <DatedList />
        <UndatedList />
        <Filterer />
        <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
        <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
        <div id="darkenBG"></div>
        <Login setPage={setPage} />
      </>
    );
  else if (page == 'forgot')
    return (
      <>
        <DatedList />
        <UndatedList />
        <Filterer />
        <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
        <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
        <div id="darkenBG"></div>
        <ForgotPassword setPage={setPage} />
      </>
    );
  else if (page == 'main')
    return (
      <>
        <DatedList />
        <UndatedList />
        <Filterer />
        <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
        <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
      </>
    );
}

export default App;
