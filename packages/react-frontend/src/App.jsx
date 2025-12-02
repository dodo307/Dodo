// src/App.jsx
import { useEffect, useState, useRef, useCallback } from 'react';
import Task from './task.jsx';
import Login from './login.jsx';
import CreateTask from './createTask.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';
import { loginUser, signupUser, hintUser, getTasks, getUser, getUserById } from './requests.jsx';
import AccountCircle from './assets/account_circle.svg';
import Account from './account.jsx';
import Settings from './settings.jsx';
import SettingsGear from './assets/settings_gear.svg';

// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function App() {
  // Current page. Determines the state of Window and more
  const [page, setPage] = useState('main');

  // Lists of tasks split into dated and undated
  const [undatedList, setUndatedList] = useState([]);
  const [datedList, setDatedList] = useState([]);
  // Object with filter options. See filterFunc
  const [filter, setFilter] = useState({
    checked: '-',
    tags: [],
  });
  const selectTask = useRef(undefined); // For the current task being created/edited

  // Profile object storing
  const [profile, setProfile] = useState({
    username: '',
    tags: [],
    _id: undefined,
  });
  // Auth token
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const [token, _setToken] = useState(INVALID_TOKEN);

  const loadUser = useCallback((newProfile, token) => {
    setProfile(newProfile);
    Task.setUserId(newProfile._id);
    localStorage.setItem('userId', newProfile._id);
    getTasks(newProfile._id, token).then(tasks => {
      tasks.forEach(x => Task.fromJSON(JSON.stringify(x)));
      console.log(tasks);
      setUndatedList(tasks.filter(x => !x.date));
      setDatedList(tasks.filter(x => x.date));
      setPage('main');
    });
  }, []);

  function setToken(newToken) {
    _setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  useEffect(() => {
    // Try and get profile based on locally stored userId and token
    const userId = localStorage.getItem('userId');
    const localToken = localStorage.getItem('token');
    getUserById(userId, localToken)
      .then(newProfile => {
        setToken(localToken);
        loadUser(newProfile, localToken);
      })
      .catch(() => {
        // If failed, go to login
        setPage('login');
      });
  }, [loadUser]);

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
    setPage('account');
  }

  // TODO
  function viewSettings() {
    setPage('settings');
  }

  // Used for both task creation and edits
  function createTask(task) {
    selectTask.current = task;
    setPage('createTask');
  }

  // Ran once a login/signup has become successful
  function loginSuccess(username) {
    getUser(username, token).then(newProfile => loadUser(newProfile, token));

    /* 
    OLD TEST DATA
    setUndatedList([new Task('Test', ['asdf', 'jkl']), new Task('Foo')]);

    setDatedList([
      new Task('Test', ['asdf', 'jkl'], '', new Date()),
      new Task('Foo', [], '', new Date()),
    ]);
    */
  }

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
        hintUser={hintUser}
        loginSuccess={loginSuccess}
        setDatedList={setDatedList}
        setUndatedList={setUndatedList}
        profile={profile} // Not used yet but probably for profile page potentially
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
            hintUser={props.hintUser}
            onSuccess={props.loginSuccess}
          />
        </>
      );
    case 'account':
      return (
        <>
          <div id="darkenBG"></div>
          <Account setPage={setPage} />
        </>
      );
    case 'settings':
      return (
        <>
          <div id="darkenBG"></div>
          <Settings setPage={setPage} />
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
            newTask={!task.current._id} // Cheese to check if task is new
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
