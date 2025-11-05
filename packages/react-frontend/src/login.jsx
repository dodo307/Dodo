import { useState } from 'react';

function Login(props) {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    let newLoginInfo = {};
    Object.assign(newLoginInfo, loginInfo);
    newLoginInfo[name] = value;
    setLoginInfo(newLoginInfo);
  }

  function submitForm() {
    props.handleSubmit(loginInfo);
    props.setPage('main');
  }

  return (
    <div id="login" className="window">
      <form>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Value"
          value={loginInfo.username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Value"
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
