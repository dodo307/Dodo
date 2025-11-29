// src/App.jsx
import { useEffect, useState, useRef } from 'react';
import Task from './task.jsx';
import Login from './login.jsx';
import ForgotPassword from './forgotPassword.jsx';
import CreateTask from './createTask.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';
import { loginUser, signupUser, getTasks } from './requests.jsx';
import AccountCircle from './assets/account_circle.svg';
import SettingsGear from './assets/settings_gear.svg';

// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function App() {
  // Current page. Determines the state of Window and more
  const [page, setPage] = useState('login');

  // Lists of tasks split into dated and undated
  const [undatedList, setUndatedList] = useState([]);
  const [datedList, setDatedList] = useState([]);
  // Object with filter options. See filterFunc
  const [filter, setFilter] = useState({
    checked: '-',
    tags: [],
  });
  const selectTask = useRef(undefined); // For the current task being created/edited

  // Username storing
  const [username, setUsername] = useState(undefined);
  // Auth token
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const [token, setToken] = useState(INVALID_TOKEN);

  // Let Escape key return to main
  useEffect(() => {
    const onKeyDown = event => {
      // Exit to main page if escape is pressed. Doesn't activate if on main already or during login
      if (event.key == 'Escape' && page != 'login' && page != 'main' && page != 'forgot')
        setPage('main');
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [page]);

  // TODO
  function viewAccount() {
    console.log('View Account Here Please');
  }

  // TODO
  function viewSettings() {
    console.log('View Settings Hear Please');
  }

  // Used for both task creation and edits
  function createTask(task) {
    selectTask.current = task;
    setPage('createTask');
  }

  // // Promise that logs a user in. Returns true if successful. Returns a string representing the error message if failed.
  // function loginUser(creds) {
  //   const url = new URL('/login', API_BASE);
  //   const promise = fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(creds),
  //   }).then(response => {
  //     if (response.status === 200) {
  //       // success
  //       response.json().then(payload => setToken(payload.token));
  //       // setMessage(`Login successful; auth token saved`);
  //       return true;
  //     } else {
  //       // failed
  //       // setMessage(`Login Error ${response.status}: ${response.data}`);
  //       if (response.status === 401) {
  //         return 'Username or password is incorrect';
  //       }
  //       return response.text();
  //     }
  //   });

  //   return promise;
  // }

  // // Promise that signs a user up. Returns true if successful. Returns a string representing the error message if failed.
  // function signupUser(creds) {
  //   console.log(JSON.stringify(creds));
  //   const url = new URL('/signup', API_BASE);
  //   const promise = fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(creds),
  //   }).then(response => {
  //     if (response.status === 201) {
  //       // success
  //       response.json().then(payload => setToken(payload.token));
  //       // setMessage(`Signup successful for user: ${creds.username}; auth token saved`);
  //       return true;
  //     } else {
  //       // failed
  //       // setMessage(`Signup Error ${response.status}: ${response.data}`);
  //       return response.text();
  //     }
  //   });

  //   return promise;
  // }

  // Ran once a login/signup has become successful
  function loginSuccess(userId) {
    // TODO: GET TASKS FROM DATABASE HERE
    getTasks(token, userId).then(tasks => console.log(tasks)); // getTasks test. Doesn't work properly right now
    setUsername(userId);

    setUndatedList([new Task('Test', ['asdf', 'jkl']), new Task('Foo')]);

    setDatedList([
      new Task('Test', ['asdf', 'jkl'], '', new Date()),
      new Task('Foo', [], '', new Date()),
    ]);
  }

  // When doing fetch() or any other request to localhost:8000, set headers to addAuthHeader({otherHeaders: here})
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

  // Filter function. Takes in a task as argument and returns true if it passes all the filters
  function filterFunc(task) {
    // Checked
    switch (filter.checked) {
      case 'Yes':
        if (!task.checked) return false;
        break;
      case 'No':
        if (task.checked) return false;
        break;
    }

    // Tags
    for (let i in filter.tags) {
      if (!task.tags.includes(filter.tags[i])) return false;
    }

    // Passed all filters
    return true;
  }

  return (
    <>
      <DatedList
        list={datedList}
        createTask={createTask}
        updateList={setDatedList}
        filter={filter}
        setFilter={setFilter}
        filterFunc={filterFunc}
        setPage={setPage}
      />
      <UndatedList
        list={undatedList}
        createTask={createTask}
        updateList={setUndatedList}
        filter={filter}
        setFilter={setFilter}
        filterFunc={filterFunc}
        setPage={setPage}
      />
      <Filterer filter={filter} setFilter={setFilter} />
      <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
      <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
      <Window
        page={page}
        setPage={setPage}
        task={selectTask}
        loginUser={loginUser.bind(undefined, setToken)}
        signupUser={signupUser.bind(undefined, setToken)}
        loginSuccess={loginSuccess}
        setDatedList={setDatedList}
        setUndatedList={setUndatedList}
        username={username} // Not used yet but probably for profile page potentially
      />
    </>
  );
}

// Pop-up window component. Return the window as well as a <div id="darkenBG"></div> behind it for the darken effect.
function Window(props) {
  const page = props.page;
  const setPage = props.setPage;
  const task = props.task;

  switch (page) {
    case 'login':
      return (
        <>
          <div id="darkenBG"></div>
          <Login
            setPage={setPage}
            loginUser={props.loginUser}
            signupUser={props.signupUser}
            onSuccess={props.loginSuccess}
          />
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
      console.log(Task.taskCount);
      return (
        <>
          <div id="darkenBG"></div>
          <CreateTask
            setPage={setPage}
            task={task}
            newTask={task.current._id == Task.taskCount - 1} // Cheese to check if task is new
            setDatedList={props.setDatedList}
            setUndatedList={props.setUndatedList}
          />
        </>
      );
    default: // Don't display anything if there's no window to display
      return <></>;
  }
}

export default App;
