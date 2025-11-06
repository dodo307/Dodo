import { useState } from 'react';

function Login(props) {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    pwd: '',
  });

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
    const promise = isLogin ? props.loginUser : props.signupUser;
    promise(loginInfo).then(ret => ret === true ? props.setPage("main") : setErrmsg(ret));
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
          name="pwd"
          id="pwd"
          placeholder="Value"
          value={loginInfo.pwd}
          onChange={handleChange}
        />
        <input type="button" value={isLogin ? "Sign In" : "Sign Up"} onClick={submitForm} />
        <span style={{color: "#cc0000", display: errmsg ? "inline" : "none"}}>
          {errmsg}
          <br />
        </span>
        <a style={{display: isLogin ? "inline" : "none"}}>Forgot Password? <br /></a>
        <a onClick={() => {
          setIsLogin(!isLogin);
          setErrmsg(undefined);
        }}>{isLogin ? "New account?" : "Already have an account?"}</a>
      </form>
    </div>
  );
}

export default Login;
