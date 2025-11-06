// src/App.jsx
import { useState } from 'react';
import Login from './login.jsx';
import CreateTask from './createTask.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';
import AccountCircle from './assets/account_circle.svg';
import SettingsGear from './assets/settings_gear.svg';

export class Task {
  static taskCount = 0;

  constructor(name, tags = [], desc = '', date = undefined, time = undefined) {
    this.name = name;
    this.id = Task.taskCount++;
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

  const [undatedList, setUndatedList] = useState([
    new Task('Test'),
    new Task('Foo'),
    new Task('Foo'),
    new Task('Foo'),
    new Task('Foo'),
    new Task('Foo'),
    new Task('Foo'),
    new Task('Foo'),
  ]);
  const [datedList, setDatedList] = useState([
    new Task('Test', [], '', 'date', 'lmao'),
    new Task('Foo', [], '', 'date', 'bar'),
    new Task('Foo', [], '', 'bar', 'lmao'),
    new Task('Foo', [], '', 'bar', 'lmao'),
    new Task('Foo', [], '', 'bar', 'lmao'),
    new Task('Foo', [], '', 'bar', 'lmao'),
    new Task('Foo', [], '', 'bar', 'lmao'),
    new Task('Foo', [], '', 'bar', 'lmao'),
  ]);

  function viewAccount() {
    console.log('View Account Here Please');
  }

  function viewSettings() {
    console.log('View Settings Hear Please');
  }

  return (
    <>
      <DatedList list={datedList} setPage={setPage} />
      <UndatedList list={undatedList} setPage={setPage} />
      <Filterer />
      <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
      <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
      <Window page={page} setPage={setPage} />
    </>
  );
}

function Window(props) {
  const page = props.page;
  const setPage = props.setPage;

  switch (page) {
    case 'login':
      return (
        <>
          <div id="darkenBG"></div>
          <Login setPage={setPage} />
        </>
      );
    case 'createTask':
      return (
        <>
          <div id="darkenBG"></div>
          <CreateTask setPage={setPage} />
        </>
      );
    default:
      return <></>;
  }
}

export default App;
