// src/App.jsx
import { useState } from 'react';
import Login from './login.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';
import AccountCircle from './assets/account_circle.svg';
import SettingsGear from './assets/settings_gear.svg';

class Task {
  constructor(name, id, tags=[], desc="", date=undefined, time=undefined) {
    this.name = name;
    this.id = id;
    this.tags = [...tags];
    this.desc = desc;
    this.date = date;
    this.time = time;
    this.dated = !!date;
  }
}

function App() {
  // Currently just login page
  const [page, setPage] = useState('login');

  const [undatedList, setUndatedList] = useState([]);
  const [datedList, setDatedList] = useState([new Task("Test", 1, [], "", "date", "lmao"), new Task("Foo", 2, [], "", "date", "bar"), new Task("Foo", 2, [], "", "bar", "lmao"), new Task("Foo", 2, [], "", "bar", "lmao"), new Task("Foo", 2, [], "", "bar", "lmao"), new Task("Foo", 2, [], "", "bar", "lmao"), new Task("Foo", 2, [], "", "bar", "lmao"), new Task("Foo", 2, [], "", "bar", "lmao")]);

  function viewAccount() {
    console.log('View Account Here Please');
  }

  function viewSettings() {
    console.log('View Settings Hear Please');
  }

  if (page == 'login')
    return (
      <>
        <DatedList list={datedList}/>
        <UndatedList list={undatedList}/>
        <Filterer />
        <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
        <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
        <div id="darkenBG"></div>
        <Login setPage={setPage} />
      </>
    );
  else if (page == 'main')
    return (
      <>
        <DatedList list={datedList}/>
        <UndatedList list={undatedList}/>
        <Filterer />
        <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
        <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
      </>
    );
}

export default App;
