// import { set } from 'mongoose'; Commented out temporarily for linting
import { useState } from 'react';

function Login(props) {
  // Object for username and password
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    pwd: '',
    pwdHint: '',
  });

  const buttonText = ['Sign In', 'Sign Up', 'Get Hint'];

  const [pwdHint, setPwdHint] = useState('');

  // Confirm password string
  const [confirmPwd, setConfirmPwd] = useState('');

  // Login state contants
  const [LOGIN, SIGNUP, FORGOTPWD] = [0, 1, 2];

  //login states which switches between login, signup, and forgot password
  const [loginState, setloginState] = useState(LOGIN);

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

  function validateForm(loginState) {
    if (loginState == LOGIN) {
      if (!loginInfo.username.length) return setErrmsg('Username can not be empty');
      if (!loginInfo.pwd.length) return setErrmsg('Password can not be empty');
    } else if (loginState == SIGNUP) {
      if (!loginInfo.username.length) return setErrmsg('Username can not be empty');
      if (!loginInfo.pwd.length) return setErrmsg('Password can not be empty');
      if (confirmPwd != loginInfo.pwd)
        return setErrmsg('Password and password confirmation do not match');
    } else if (loginState == FORGOTPWD) {
      if (!loginInfo.username.length) return setErrmsg('Username can not be empty');
    }
  }

  // Do basic checks before submitting username and password to backend
  function submitForm() {
    let promise;
    validateForm(loginState);
    if (loginState == LOGIN) {
      promise = props.loginUser;
    } else if (loginState == SIGNUP) {
      promise = props.signupUser;
    } else if (loginState == FORGOTPWD) {
      promise = props.hintUser;
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
        <label htmlFor="pwd" style={{ display: loginState == FORGOTPWD ? 'none' : 'block' }}>
          Password
        </label>
        <input
          type="password"
          name="pwd"
          id="pwd"
          placeholder="Value"
          value={loginInfo.pwd}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          style={{ display: loginState == FORGOTPWD ? 'none' : 'inline' }}
        />
        {/* Password Confirmation */}
        <label htmlFor="confirmPwd" style={{ display: loginState != SIGNUP ? 'none' : 'block' }}/>
        <input
          type="password"
          name="confirmPwd"
          id="confirmPwd"
          placeholder="Value"
          value={confirmPwd}
          onChange={event => setConfirmPwd(event.target.value)}
          onKeyDown={onKeyDown}
          style={{ display: loginState != SIGNUP ? 'none' : 'inline' }}
        />
        <label htmlFor="pwdHint" style={{ display: loginState != SIGNUP ? 'none' : 'block' }}>
          Password Hint
        </label>
        <input
          type="text"
          name="pwdHint"
          id="pwdHint"
          placeholder="Value"
          value={pwdHint}
          onChange={event => setPwdHint(event.target.value)}
          onKeyDown={onKeyDown}
          style={{ display: loginState != SIGNUP ? 'none' : 'inline' }}
        />
        <a style={{ display: loginState != FORGOTPWD ? 'none' : 'inline' }}>
          {pwdHint != '' ? `Password Hint: ${pwdHint}` : ''}
          <br />
        </a>
        {/* Submit button */}
        <input type="button" value={buttonText[loginState]} onClick={submitForm} />
        {/* Error Message. Display only if errmsg exists */}
        <span style={{ color: '#cc0000', display: errmsg ? 'inline' : 'none' }}>
          {errmsg}
          <br />
        </span>
        {/* Forgot Password */}
        <a
          style={{ display: loginState == SIGNUP ? 'none' : 'inline' }}
          onClick={() => {
            setloginState(loginState == LOGIN ? FORGOTPWD : LOGIN);
          }}
        >
          {loginState == LOGIN ? 'Forgot Password?' : 'Back to Login'}
          <br />
        </a>
        {/* Login/SignUp window toggle */}
        <a
          style={{ display: loginState != FORGOTPWD ? 'inline' : 'none' }}
          onClick={() => {
            setloginState(loginState == LOGIN ? SIGNUP : LOGIN);
            setErrmsg(undefined);
          }}
        >
          {loginState == LOGIN ? 'New account?' : 'Already have an account?'}
        </a>
      </form>
    </div>
  );
}

export default Login;
