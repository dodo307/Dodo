import { useState } from 'react';

function Login(props) {
  // Object for username and password
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    pwd: '',
    pwdHint: '',
  });

  // Button text for different login states
  const buttonText = ['Sign In', 'Sign Up', 'Get Hint'];

  // Error messages for validation
  const errMsgs = {
    EMPTY_USERNAME: 'Username can not be empty',
    EMPTY_PWD: 'Password can not be empty',
    EMPTY_PWDHINT: 'Password Hint can not be empty',
    PWD_MISMATCH: 'Password and password confirmation do not match',
  };

  // Confirm password string
  const [confirmPwd, setConfirmPwd] = useState('');

  // Password hint retrieved from backend
  const [retrievedHint, setRetrievedHint] = useState('');

  // Login state contants
  const [LOGIN, SIGNUP, FORGOTPWD] = [0, 1, 2];

  // Login states which switches between login, signup, and forgot password
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

  // Reset all fields when switching between login, signup, and forgot password
  function resetFormFields() {
    setLoginInfo({
      username: '',
      pwd: '',
      pwdHint: '',
    });
    setConfirmPwd('');
    setErrmsg(undefined);
    setRetrievedHint && setRetrievedHint('');
  }

  // Validate form fields before submission
  function validateForm(loginState) {
    switch (loginState) {
      case LOGIN:
        if (!loginInfo.username.length) {
          setErrmsg(errMsgs.EMPTY_USERNAME);
          return false;
        }
        if (!loginInfo.pwd.length) {
          setErrmsg(errMsgs.EMPTY_PWD);
          return false;
        }
        break;
      case SIGNUP:
        if (!loginInfo.username.length) {
          setErrmsg(errMsgs.EMPTY_USERNAME);
          return false;
        }
        if (!loginInfo.pwd.length) {
          setErrmsg(errMsgs.EMPTY_PWD);
          return false;
        }
        if (!loginInfo.pwdHint.length) {
          setErrmsg(errMsgs.EMPTY_PWDHINT);
          return false;
        }
        if (confirmPwd != loginInfo.pwd) {
          setErrmsg(errMsgs.PWD_MISMATCH);
          return false;
        }
        break;
      case FORGOTPWD:
        if (!loginInfo.username.length) {
          setErrmsg(errMsgs.EMPTY_USERNAME);
          return false;
        }
        break;
      default:
        return false;
    }
    setErrmsg(undefined);
    return true;
  }

  // Do basic checks before submitting username and password to backend
  function submitForm() {
    let promise;
    if (!validateForm(loginState)) return;
    if (loginState == LOGIN) {
      promise = props.loginUser;
    } else if (loginState == SIGNUP) {
      promise = props.signupUser;
    } else if (loginState == FORGOTPWD) {
      promise = props.hintUser;
    }

    promise(loginInfo).then(ret => {
      if (ret === true) {
        props.onSuccess(loginInfo.username);
        return;
      }

      if (loginState === FORGOTPWD) {
        setRetrievedHint(ret || '');
        setErrmsg(undefined);
      } else {
        setErrmsg(ret);
      }
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
        <label htmlFor="confirmPwd" style={{ display: loginState != SIGNUP ? 'none' : 'block' }}>
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
          value={loginInfo.pwdHint}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          style={{ display: loginState != SIGNUP ? 'none' : 'inline' }}
        />
        <p style={{ display: loginState != FORGOTPWD ? 'none' : 'inline' }}>
          {retrievedHint != '' ? `Password Hint: ${retrievedHint}` : ''}
          <br />
        </p>
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
            resetFormFields();
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
            resetFormFields();
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
