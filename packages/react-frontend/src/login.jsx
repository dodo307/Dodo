import { useState } from 'react';

function Login(props) {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    pwd: '',
  });

  const [confirmPwd, setConfirmPwd] = useState('');

  const [isLogin, setIsLogin] = useState(true);

  const [errmsg, setErrmsg] = useState(undefined);

  function handleChange(event) {
    const { name, value } = event.target;
    let newLoginInfo = {};
    Object.assign(newLoginInfo, loginInfo);
    newLoginInfo[name] = value;
    setLoginInfo(newLoginInfo);
  }

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
    promise(loginInfo).then(ret => (ret === true ? props.setPage('main') : setErrmsg(ret)));
  }

  const onKeyDown = event => {
    if (event.key == 'Enter') submitForm();
  };

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
          onKeyDown={onKeyDown}
        />
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
          style={{ display: isLogin ? 'none' : 'inline' }}
        />
        <input type="button" value={isLogin ? 'Sign In' : 'Sign Up'} onClick={submitForm} />
        <span style={{ color: '#cc0000', display: errmsg ? 'inline' : 'none' }}>
          {errmsg}
          <br />
        </span>
        <a style={{ display: isLogin ? 'inline' : 'none' }}>
          Forgot Password?
          <br />
        </a>
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
