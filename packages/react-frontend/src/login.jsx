import { useState } from 'react';

function Login(props) {
  // Object for username and password
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    pwd: '',
  });

  // Confirm password string
  const [confirmPwd, setConfirmPwd] = useState('');

  // Login vs SignUp. If Login -> true. If SignUp -> false
  const [isLogin, setIsLogin] = useState(true);

  // Red error message string
  const [errmsg, setErrmsg] = useState(undefined);

  // Update loginInfo every time a change occurs
  function handleChange(event) {
    const { name, value } = event.target;
    let newLoginInfo = {};
    Object.assign(newLoginInfo, loginInfo);
    newLoginInfo[name] = value;
    setLoginInfo(newLoginInfo);
  }

  // Do basic checks before submitting username and password to backend
  function submitForm() {
    if (!loginInfo.username.length) {
      setErrmsg('Username can not be empty');
      return;
    }
    if (!loginInfo.pwd.length) {
      setErrmsg('Password can not be empty');
      return;
    }
    let promise;
    if (isLogin) {
      promise = props.loginUser;
    } else {
      promise = props.signupUser;
      if (confirmPwd != loginInfo.pwd) {
        setErrmsg('Password and password confirmation do not match');
        return;
      }
    }

    promise(loginInfo).then(ret => {
      if (ret === true) {
        props.onSuccess();
        props.setPage('main');
        return;
      }
      // Set error message upon failure
      setErrmsg(ret);
    });
  }

  // Allow enter to be used to submit username and password
  const onKeyDown = event => {
    if (event.key == 'Enter') submitForm();
  };

  return (
    <div id="login" className="window">
      {/* Form for the window */}
      <form>
        {/* Username */}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Value"
          value={loginInfo.username}
          onChange={handleChange}
          onKeyDown={onKeyDown}
        />
        {/* Password */}
        <label htmlFor="pwd">Password</label>
        <input
          type="password"
          name="pwd"
          id="pwd"
          placeholder="Value"
          value={loginInfo.pwd}
          onChange={handleChange}
          onKeyDown={onKeyDown}
        />
        {/* Password Confirmation. Only display if on SignUp (!isLogin) */}
        <label htmlFor="confirmPwd" style={{ display: isLogin ? 'none' : 'block' }}>
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPwd"
          id="confirmPwd"
          placeholder="Value"
          value={confirmPwd}
          onChange={event => setConfirmPwd(event.target.value)}
          onKeyDown={onKeyDown}
          style={{ display: isLogin ? 'none' : 'inline' }}
        />
        {/* Submit button */}
        <input type="button" value={isLogin ? 'Sign In' : 'Sign Up'} onClick={submitForm} />
        {/* Error Message. Display only if errmsg exists */}
        <span style={{ color: '#cc0000', display: errmsg ? 'inline' : 'none' }}>
          {errmsg}
          <br />
        </span>
        {/* Forgot Password */}
        <a
          href=""
          style={{ display: isLogin ? 'inline' : 'none' }}
          onClick={e => {
            e.preventDefault();
            props.setPage('forgot');
          }}
        >
          Forgot Password?
          <br />
        </a>
        {/* Login/SignUp window toggle */}
        <a
          onClick={() => {
            setIsLogin(!isLogin);
            setErrmsg(undefined);
          }}
        >
          {isLogin ? 'New account?' : 'Already have an account?'}
        </a>
      </form>
    </div>
  );
}

export default Login;
