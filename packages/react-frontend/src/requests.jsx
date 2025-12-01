import Task from './task';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function addAuthHeader(token, otherHeaders = {}) {
  if (token == 'INVALID TOKEN') return otherHeaders;
  return {
    ...otherHeaders,
    Authorization: `Bearer ${token}`,
  };
}

// Promise that logs a user in. Returns true if successful. Returns a string representing the error message if failed.
function loginUser(setToken, creds) {
  const url = new URL('/login', API_BASE);
  const promise = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  }).then(response => {
    if (response.status === 200) {
      // success
      response.json().then(payload => setToken(payload.token));
      // setMessage(`Login successful; auth token saved`);
      return true;
    } else {
      // failed
      // setMessage(`Login Error ${response.status}: ${response.data}`);
      if (response.status === 401) {
        return 'Username or password is incorrect';
      }
      return response.text();
    }
  });

  return promise;
}

// Promise that signs a user up. Returns true if successful. Returns a string representing the error message if failed.
function signupUser(setToken, creds) {
  console.log(JSON.stringify(creds));
  const url = new URL('/signup', API_BASE);
  const promise = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  }).then(response => {
    if (response.status === 201) {
      // success
      response.json().then(payload => setToken(payload.token));
      // setMessage(`Signup successful for user: ${creds.username}; auth token saved`);
      return true;
    } else {
      // failed
      // setMessage(`Signup Error ${response.status}: ${response.data}`);
      return response.text();
    }
  });

  return promise;
}

function getUser(username, token) {
  token = token ?? localStorage.getItem('token');
  const url = new URL(`/users/?username=${username}`, API_BASE);
  const promise = fetch(url, {
    method: `GET`,
    headers: addAuthHeader(token),
  })
    .then(response => {
      if (response.status === 200) {
        // success
        return response.json();
      } else {
        throw new Error(`getUser got a ${response.status} response when 200 was expected.`);
      }
    })
    .catch(err => console.log(err));

  return promise;
}

function getTasks(userId, token) {
  token = token ?? localStorage.getItem('token');
  const url = new URL(`/tasks/${userId}`, API_BASE);
  const promise = fetch(url, {
    method: 'GET',
    headers: addAuthHeader(token),
  })
    .then(response => {
      if (response.status === 200) {
        // success
        return response.json().then(json => {
          return json.map(obj => Task.fromJSON(JSON.stringify(obj)));
        });
      } else {
        throw new Error(`getTasks got a ${response.status} response when 200 was expected.`);
      }
    })
    .catch(err => console.log(err));

  return promise;
}

function addTask(task, token) {
  token = token ?? localStorage.getItem('token');
  const url = new URL(`/tasks`, API_BASE);
  let body = task.toJSON();

  const promise = fetch(url, {
    method: 'POST',
    headers: addAuthHeader(token, { 'Content-Type': 'application/json' }),
    body: body,
  })
    .then(response => {
      if (response.status === 201) {
        // success
        return response.text().then(text => Task.fromJSON(text));
      } else {
        throw new Error(`addTask got a ${response.status} response when 201 was expected.`);
      }
    })
    .catch(err => console.log(err));

  return promise;
}

function updateTask(task, token) {
  token = token ?? localStorage.getItem('token');
  const url = new URL(`/tasks/${task._id}/${task.userId}`, API_BASE);
  let body = task.toJSON();

  const promise = fetch(url, {
    method: 'PUT',
    headers: addAuthHeader(token, { 'Content-Type': 'application/json' }),
    body: body,
  })
    .then(response => {
      if (response.status === 201) {
        // success
        return task;
      } else {
        throw new Error(`updateTask got a ${response.status} response when 201 was expected.`);
      }
    })
    .catch(err => console.log(err));

  return promise;
}

export { loginUser, signupUser, getUser, getTasks, addTask, updateTask };
