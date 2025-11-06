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
  static taskCount = 0; // Temp unique ID generator before linking to backend

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
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState('');

  function viewAccount() {
    console.log('View Account Here Please');
  }

  function viewSettings() {
    console.log('View Settings Hear Please');
  }

  function loginUser(creds) {
    const promise = fetch(`http://localhost:8000/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then(payload => setToken(payload.token));
          setMessage(`Login successful; auth token saved`);
          return true;
        } else {
          setMessage(`Login Error ${response.status}: ${response.data}`);
          if (response.status === 401) {
            return "Username or password is incorrect";
          }
          return response.text();
        }
      })
      .catch(error => {
        setMessage(`Login Error: ${error}`);
      });

    return promise;
  }

  function signupUser(creds) {
    console.log(JSON.stringify(creds));
    const promise = fetch(`http://localhost:8000/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    })
      .then(response => {
        if (response.status === 201) {
          response.json().then(payload => setToken(payload.token));
          setMessage(`Signup successful for user: ${creds.username}; auth token saved`);
          return true;
        } else {
          setMessage(`Signup Error ${response.status}: ${response.data}`);
          return response.text();
        }
      })
      .catch(error => {
        setMessage(`Signup Error: ${error}`);
      });

    return promise;
  }

  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    } else {
      return {
        ...otherHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  return (
    <>
      <DatedList list={datedList} setPage={setPage} />
      <UndatedList list={undatedList} setPage={setPage} />
      <Filterer />
      <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
      <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
      <Window page={page} setPage={setPage} loginUser={loginUser} signupUser={signupUser}/>
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
          <Login setPage={setPage} loginUser={props.loginUser} signupUser={props.signupUser}/>
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
