// src/App.jsx
import { useEffect, useState, useRef, useCallback } from 'react';
import Task from './task.jsx';
import Login from './login.jsx';
import CreateTask from './createTask.jsx';
import DatedList from './datedList.jsx';
import UndatedList from './undatedList.jsx';
import Filterer from './filterer.jsx';
import {
  loginUser,
  signupUser,
  hintUser,
  getTasks,
  getUser,
  getUserById,
  changeUsername,
  changePassword,
  changePwdHint,
} from './requests.jsx';
import AccountCircle from './assets/account_circle.svg';
import Account from './account.jsx';
import Settings from './settings.jsx';
import SettingsGear from './assets/settings_gear.svg';

function App() {
  // Current page. Determines the state of Window and more
  const [page, setPage] = useState('main');

  // Lists of tasks split into dated and undated
  const [undatedList, setUndatedList] = useState([]);
  const [datedList, setDatedList] = useState([]);
  // Default date for datedList. Upon change, also changes the date in datedList
  const [defaultDate, setDefaultDate] = useState(undefined);
  // Object with filter options. See filterFunc
  const [filter, setFilter] = useState({
    checked: '-',
    tags: [],
  });
  const selectTask = useRef(undefined); // For the current task being created/edited

  // Profile object storing
  const [profile, setProfile] = useState({
    username: '',
    pwdHint: '',
    tags: [],
    _id: undefined,
  });
  // Auth token
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const [token, _setToken] = useState(INVALID_TOKEN);

  // Need to do useCallback so that it can be a stable dependency
  const loadUser = useCallback((newProfile, token) => {
    console.log(newProfile);
    setProfile(newProfile); // Update profile
    Task.setUserId(newProfile._id); // Set userId for all Tasks that will be created here
    localStorage.setItem('userId', newProfile._id); // Store userId in local storage
    // Grab tasks from database
    getTasks(newProfile._id, token).then(tasks => {
      // Convert the objects into Tasks
      tasks.forEach(x => Task.fromJSON(JSON.stringify(x)));
      console.log(tasks);

      // Set the lists based on the tasks that have dates or no dates
      setUndatedList(tasks.filter(x => !x.date));
      setDatedList(tasks.filter(x => x.date));

      // Enter main page
      setPage('main');
    });
  }, []);

  // Replacing the original setToken to also store the token into localStorage
  function setToken(newToken) {
    _setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  useEffect(() => {
    // Try and get profile based on locally stored userId and token
    const userId = localStorage.getItem('userId');
    const localToken = localStorage.getItem('token');
    getUserById(userId, localToken, false)
      .then(newProfile => {
        // Success. Move on to loading the user in
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

  // Account button onClick
  function viewAccount() {
    setPage('account');
  }

  // Settings button onClick
  function viewSettings() {
    setPage('settings');
  }

  // Used for both task creation and edits
  function createTask(task) {
    selectTask.current = task;
    setPage('createTask');
  }

  // Reset credentials and change page accordingly
  function refreshCreds() {
    setToken(INVALID_TOKEN);
    setProfile({
      username: '',
      pwdHint: '',
      tags: [],
      _id: undefined,
    });
    localStorage.setItem('userId', undefined);
    setDatedList([]);
    setUndatedList([]);
  }

  // Ran once a login/signup has become successful
  function loginSuccess(username) {
    const newToken = localStorage.getItem('token');
    getUser(username, newToken).then(newProfile => loadUser(newProfile, newToken));

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
      {/* Task lists */}
      <DatedList
        list={datedList}
        createTask={createTask}
        updateList={setDatedList}
        filter={filter}
        setFilter={setFilter}
        filterFunc={filterFunc}
        setPage={setPage}
        defaultDate={defaultDate}
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
      {/* Filter UI */}
      <Filterer filter={filter} setFilter={setFilter} />
      {/* Corner Buttons */}
      <img id="accountCircle" src={AccountCircle} onClick={viewAccount}></img>
      <img id="settingsGear" src={SettingsGear} onClick={viewSettings}></img>
      {/* Window */}
      <Window
        page={page}
        setPage={setPage}
        task={selectTask}
        username={profile.username}
        refreshCreds={refreshCreds}
        loginUser={loginUser.bind(undefined, setToken)}
        signupUser={signupUser.bind(undefined, setToken)}
        hintUser={hintUser}
        loginSuccess={loginSuccess}
        setUndatedList={setUndatedList}
        setDatedList={setDatedList}
        setDefaultDate={setDefaultDate}
        changeUsername={changeUsername.bind(undefined, profile._id, setProfile)}
        changePassword={changePassword.bind(undefined, profile._id)}
        changePwdHint={changePwdHint.bind(undefined, profile._id, setProfile)}
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
  const username = props.username;

  switch (page) {
    case 'login': // Login page/window. Also includes Signup and Forgot Pwd
      return (
        <>
          <div id="darkenBG"></div>
          <Login
            setPage={setPage}
            refreshCreds={props.refreshCreds}
            loginUser={props.loginUser}
            signupUser={props.signupUser}
            hintUser={props.hintUser}
            onSuccess={props.loginSuccess}
          />
        </>
      );
    case 'account': // Account window. Used when account button is clicked
      return (
        <>
          <div id="darkenBG"></div>
          <Account username={username} setPage={setPage} refreshCreds={props.refreshCreds} />
        </>
      );
    case 'settings': // Settings window. Used when settings button is clicked
      return (
        <>
          <div id="darkenBG"></div>
          <Settings
            setPage={setPage}
            refreshCreds={props.refreshCreds}
            changeUsername={props.changeUsername}
            changePassword={props.changePassword}
            changePwdHint={props.changePwdHint}
            // onSuccess={props.loginSuccess}
            profile={props.profile}
          />
        </>
      );
    case 'createTask': // Create/Edit task window. Used when editing or creating a new task
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
            setDefaultDate={props.setDefaultDate}
          />
        </>
      );
    default: // Don't display anything if there's no window to display
      return <></>;
  }
}

export default App;
