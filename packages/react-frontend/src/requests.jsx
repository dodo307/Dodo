const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function addAuthHeader(token, otherHeaders = {}) {
  if (token == 'INVALID TOKEN') return otherHeaders;
  return {
    ...otherHeaders,
    Authorization: `Bearer ${token}`,
  };
}

// Promise that logs a user in. Returns true if successful. Returns a string representing the error message if failed.
export function loginUser(setToken, creds) {
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
export function signupUser(setToken, creds) {
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

// Not working right now. Got to figure out how to get the userId because it's not the same as username
export function getTasks(token, userId) {
  const url = new URL(`/tasks/${userId}`, API_BASE);
  const promise = fetch(url, {
    method: 'GET',
    headers: addAuthHeader(token),
  })
    .then(response => {
      if (response.status === 200) {
        // success
        return response.json();
      } else {
        throw new Error(`getTasks returned ${response.status} when 200 was expected.`);
      }
    })
    .catch(err => console.log(err));

  return promise;
}
