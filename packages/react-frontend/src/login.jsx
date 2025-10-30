import { useState } from 'react';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    if (name == 'username') setLoginInfo({ username: value, password: setLoginInfo['password'] });
    if (name == 'password') setLoginInfo({ username: loginInfo['username'], password: value });
  }

  function submitForm() {}

  return (
    <div id="login">
      <form>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={loginInfo.username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={loginInfo.password}
          onChange={handleChange}
        />
        <input type="button" value="Sign In" onClick={submitForm} />
        <a href="">Forgot Password?</a>
      </form>
    </div>
  );
}

export default Login;
