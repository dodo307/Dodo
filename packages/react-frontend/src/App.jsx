// src/App.jsx
import { useEffect, useState } from 'react';
import Login from './login.jsx';
import ForgotPassword from './forgotPassword.jsx';
import CreateTask from './createTask.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';
import AccountCircle from './assets/account_circle.svg';
import SettingsGear from './assets/settings_gear.svg';

export class Task {
  static taskCount = 0; // Temp unique ID generator before linking to backend

  constructor(title, tags = [], description = '', date = undefined) {
    this.title = title;
    this.id = Task.taskCount++;
    this.tags = [...tags];
    this.description = description;
    this.date = date;
    this.dated = !!date;
    this.checked = false;
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
    new Task('Test', [], '', new Date()),
    new Task('Foo', [], '', new Date()),
    new Task('Foo', [], '', new Date()),
    new Task('Foo', [], '', new Date()),
    new Task('Foo', [], '', new Date()),
    new Task('Foo', [], '', new Date()),
    new Task('Foo', [], '', new Date()),
    new Task('Foo', [], '', new Date()),
  ]);
  const [filter, setFilter] = useState({
    checked: 'none',
  });

  const INVALID_TOKEN = 'INVALID_TOKEN';
  const [, setToken] = useState(INVALID_TOKEN);
  const [, setMessage] = useState('');

  useEffect(() => {
    const onKeyDown = event => {
      // Exit to main page if escape is pressed. Doesn't activate if on main already or during login
      if (event.key == 'Escape' && page != 'login' && page != 'main') setPage('main');
    };

    document.addEventListener('keydown', onKeyDown);

    // Remove event listener when component dismounts
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

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
            return 'Username or password is incorrect';
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

  // function addAuthHeader(otherHeaders = {}) {
  //   if (token === INVALID_TOKEN) {
  //     return otherHeaders;
  //   } else {
  //     return {
  //       ...otherHeaders,
  //       Authorization: `Bearer ${token}`,
  //     };
  //   }
  // }
  // commented out addAuthHeader function for now since it's unused

  function filterFunc(task) {
    switch (filter.checked) {
      case 'checked':
        if (!task.checked) return false;
        break;
      case 'unchecked':
        if (task.checked) return false;
        break;
    }
    return true;
  }

  return (
    <>
      <DatedList list={datedList} updateList={setDatedList} filter={filterFunc} setPage={setPage} />
      <UndatedList
        list={undatedList}
        updateList={setUndatedList}
        filter={filterFunc}
        setPage={setPage}
      />
      <Filterer filter={filter} setFilter={setFilter} />
      <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
      <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
      <Window page={page} setPage={setPage} loginUser={loginUser} signupUser={signupUser} />
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
          <Login setPage={setPage} loginUser={props.loginUser} signupUser={props.signupUser} />
        </>
      );
    case 'forgot':
      return (
        <>
          <div id="darkenBG"></div>
          <ForgotPassword setPage={setPage} />
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
