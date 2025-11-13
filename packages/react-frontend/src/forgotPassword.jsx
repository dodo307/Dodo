import { useState } from 'react';

function ForgotPassword(props) {
  const [username, setUsername] = useState('');
  const [hint /*, setHint*/] = useState('');

  // setup backend api endpoints

  return (
    <div id="forgotPassword" className="window">
      <form>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Value"
          value={username}
          onChange={event => setUsername(event.target.value)}
          required
        />
        <input type="button" value="Get Hint" onClick={() => {}} />

        {hint && <p>{hint}</p>}

        <input type="button" value="Back to Login" onClick={() => props.setPage('login')} />
      </form>
    </div>
  );
}

export default ForgotPassword;
