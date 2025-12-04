import Task from './task';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// Helper function to add the token header to requests
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
  })
    .then(response => {
      if (response.status === 200) {
        // success
        return response.json().then(payload => {
          setToken(payload.token);
          return true;
        });
      } else {
        // failed
        if (response.status === 401) {
          return 'Username or password is incorrect'; // If 401 was caught
        }
        return response.text(); // Error message is the provided error message
      }
    })
    .catch(err => {
      if (err instanceof TypeError && err.message == 'Failed to fetch') {
        console.log(err);
        return 'Unable to connect to network'; // Error message for when fetch failed
      }
      throw err;
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
  })
    .then(response => {
      if (response.status === 201) {
        // success
        return response.json().then(payload => {
          setToken(payload.token);
          return true;
        });
      } else {
        // failed
        return response.text(); // Error message is the provided error message
      }
    })
    .catch(err => {
      if (err instanceof TypeError && err.message == 'Failed to fetch') {
        console.log(err);
        return 'Unable to connect to network'; // Error message for when fetch failed
      }
      throw err;
    });

  return promise;
}

// Promise that retrieves a user's password hint. Returns the hint string if successful. Returns null if failed.
function hintUser(creds, token) {
  token = token ?? localStorage.getItem(token);
  const url = new URL(`/hint/${creds.username}`, API_BASE);
  const promise = fetch(url, {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json',
    }),
  })
    .then(response => {
      if (response.status === 200) {
        // success
        return response.json().then(payload => payload.hint);
      } else {
        // Figure out error messages later
        return null;
      }
    })
    .catch(() => {
      // Figure out error messages later
      return null;
    });

  return promise;
}

// Promise to get user profile from username. Returns profile object upon success. Throws error upon failure.
function getUser(username, token, refreshOn401 = true) {
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
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        throw new Error(`getUser got a ${response.status} response when 200 was expected.`);
      }
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });

  return promise;
}

// Promise to get user profile from userId. Returns profile object upon success. Throws error upon failure.
function getUserById(userId, token, refreshOn401 = true) {
  token = token ?? localStorage.getItem('token');
  const url = new URL(`/users/?userID=${userId}`, API_BASE);
  const promise = fetch(url, {
    method: `GET`,
    headers: addAuthHeader(token),
  })
    .then(response => {
      if (response.status === 200) {
        // success
        return response.json();
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        throw new Error(`getUser got a ${response.status} response when 200 was expected.`);
      }
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });

  return promise;
}
// Promise that changes a user's username
function changeUsername(userID, setProfile, creds, refreshOn401 = true) {
  const url = new URL(`/users/${userID}`, API_BASE);
  const promise = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: creds.newUsername }),
  })
    .then(response => {
      if (response.status === 201) {
        setProfile(oldPro => {
          const newPro = { ...oldPro };
          newPro.username = creds.newUsername;
          return newPro;
        });
        return true;
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        return response.text();
      }
    })
    .catch(error => {
      return `Change Username Error: ${error}`;
    });

  return promise;
}

// Promise that changes a user's password
function changePassword(userID, creds, refreshOn401 = true) {
  const url = new URL(`/users/${userID}`, API_BASE);
  const promise = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: creds.newPassword }),
  })
    .then(response => {
      if (response.status === 201) {
        return true;
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        return response.text();
      }
    })
    .catch(error => {
      return `Change Password Error: ${error}`;
    });

  return promise;
}

// Promise that changes a user's password hint
function changePwdHint(userID, setProfile, creds, refreshOn401 = true) {
  const url = new URL(`/users/${userID}`, API_BASE);
  const promise = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pwdHint: creds.newPwdHint }),
  })
    .then(response => {
      if (response.status === 201) {
        setProfile(oldPro => {
          const newPro = { ...oldPro };
          newPro.pwdHint = creds.newPwdHint;
          return newPro;
        });
        return true;
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        return response.text();
      }
    })
    .catch(error => {
      return `Change Password Hint Error: ${error}`;
    });

  return promise;
}

// Promise to get task list from userId. Returns list of objects representing tasks upon success. Throws error upon failure.
function getTasks(userId, token, refreshOn401 = true) {
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
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        throw new Error(`getTasks got a ${response.status} response when 200 was expected.`);
      }
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });

  return promise;
}

// Promise to add new task to backend. Returns an object representing the new task upon success. Throws error upon failure.
function addTask(task, token, refreshOn401) {
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
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        throw new Error(`addTask got a ${response.status} response when 201 was expected.`);
      }
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });

  return promise;
}

// Promise to update a task to backend. Returns the orignal task upon success. Throws error upon failure.
function updateTask(task, token, refreshOn401 = true) {
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
        // Should probably just be 200 to be honest
        // success
        return task;
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        throw new Error(`updateTask got a ${response.status} response when 201 was expected.`);
      }
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });

  return promise;
}

// Promise to delete a task on the backend. Throws error upon failure.
function deleteTask(task, token, refreshOn401 = true) {
  token = token ?? localStorage.getItem('token');
  const url = new URL(`/tasks/${task._id}/${task.userId}`, API_BASE);

  const promise = fetch(url, {
    method: 'DELETE',
    headers: addAuthHeader(token),
  })
    .then(response => {
      if (response.status === 201) {
        // Should probably be a 204 to be honest
        // success
        return;
      } else if (response.status === 401 && refreshOn401) {
        alert('Session has expired. Reloading page now');
        window.location.reload();
      } else {
        throw new Error(`updateTask got a ${response.status} response when 201 was expected.`);
      }
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });

  return promise;
}

export {
  loginUser,
  signupUser,
  hintUser,
  getUser,
  getUserById,
  changeUsername,
  changePassword,
  changePwdHint,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};
