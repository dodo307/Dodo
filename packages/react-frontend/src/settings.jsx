import { useEffect, useRef, useState } from 'react';

// Settings change states (constants are fine outside the component)
const [NONE, USERNAME, PASSWORD, PASSWORD_HINT] = [0, 1, 2, 3];

function Settings(props) {
  // Settings info state
  const [settingsInfo, setSettingsInfo] = useState({
    newUsername: props.profile.username,
    newPassword: '',
    newPwdHint: props.profile.pwdHint,
  });

  const [confirmNewPwd, setConfirmNewPwd] = useState('');

  // Reference to settings box
  const boxRef = useRef(null);

  // Current change state
  const [changeState, setChangeState] = useState(NONE);

  // Error message state
  const [errmsg, setErrmsg] = useState(undefined);

  const errMsgs = {
    EMPTY_USERNAME: 'Username cannot be empty',
    EMPTY_PASSWORD: 'Password cannot be empty',
    EMPTY_PWDHINT: 'Password hint cannot be empty',
    PWD_MISMATCH: 'Passwords do not match',
  };

  // Handle click outside of settings box to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        props.setPage('main');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props]);

  // Helper to toggle back to NONE if user clicks the same button again
  function toggleChangeState(targetState) {
    setChangeState(prev => (prev === targetState ? NONE : targetState));
  }

  // Reset all form fields
  function resetFormFields() {
    setChangeState(NONE);
    // setSettingsInfo({
    //   newUsername: '',
    //   newPassword: '',
    //   newPwdHint: '',
    // });
    setConfirmNewPwd('');
    setErrmsg(undefined);
  }

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;
    let newSettingsInfo = {};
    Object.assign(newSettingsInfo, settingsInfo);
    newSettingsInfo[name] = value;
    setSettingsInfo(newSettingsInfo);
  }

  // Validate settings input before submission
  function validateSettings(state) {
    switch (state) {
      case USERNAME:
        if (!settingsInfo.newUsername.trim().length) {
          setErrmsg(errMsgs.EMPTY_USERNAME);
          return false;
        }
        break;
      case PASSWORD:
        if (!settingsInfo.newPassword.length) {
          setErrmsg(errMsgs.EMPTY_PASSWORD);
          return false;
        }
        if (confirmNewPwd != settingsInfo.newPassword) {
          setErrmsg(errMsgs.PWD_MISMATCH);
          return false;
        }
        break;
      case PASSWORD_HINT:
        if (!settingsInfo.newPwdHint.trim().length) {
          setErrmsg(errMsgs.EMPTY_PWDHINT);
          return false;
        }
        break;
      case NONE:
      default:
        return false;
    }
    setErrmsg(undefined);
    return true;
  }

  function submitForm() {
    let promise;
    if (!validateSettings(changeState)) return;

    if (changeState === USERNAME) {
      promise = props.changeUsername;
    } else if (changeState === PASSWORD) {
      promise = props.changePassword;
    } else if (changeState === PASSWORD_HINT) {
      promise = props.changePwdHint;
    }

    if (!promise) return;

    promise(settingsInfo).then(ret => {
      if (ret === true) {
        resetFormFields();
        setChangeState(NONE);
      } else {
        // ret is likely a string error from your App functions
        setErrmsg(ret || 'Something went wrong');
      }
    });
  }

  // Allow enter to be used to submit username and password
  const onKeyDown = event => {
    if (event.key == 'Enter') submitForm();
  };

  return (
    <div id="settings" className="window" ref={boxRef}>
      <div id="cross" onClick={() => props.setPage('main')}>
        &#10005;
      </div>
      <h1 style={{ display: 'block', textAlign: 'center' }}>Settings</h1>

      {/* change sections */}
      {changeState === USERNAME && (
        <div style={{ marginTop: '10px' }}>
          <label>New Username</label>
          <input
            type="text"
            name="newUsername"
            placeholder="Value"
            value={settingsInfo.newUsername}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
          <span style={{ color: '#cc0000', display: errmsg ? 'inline' : 'none' }}>
            {errmsg}
            <br />
          </span>
          <input type="button" value="Done" style={{ marginTop: '5px' }} onClick={submitForm} />
        </div>
      )}

      {changeState === PASSWORD && (
        <div style={{ marginTop: '10px' }}>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Value"
            value={settingsInfo.newPassword}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPwd"
            placeholder="Value"
            value={confirmNewPwd}
            onChange={event => setConfirmNewPwd(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <span style={{ color: '#cc0000', display: errmsg ? 'inline' : 'none' }}>
            {errmsg}
            <br />
          </span>
          <input type="button" value="Done" style={{ marginTop: '5px' }} onClick={submitForm} />
        </div>
      )}

      {changeState === PASSWORD_HINT && (
        <div style={{ marginTop: '10px' }}>
          <label>New Password Hint</label>
          <input
            type="text"
            name="newPwdHint"
            placeholder="Value"
            value={settingsInfo.newPwdHint}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
          <span style={{ color: '#cc0000', display: errmsg ? 'inline' : 'none' }}>
            {errmsg}
            <br />
          </span>
          <input type="button" value="Done" style={{ marginTop: '5px' }} onClick={submitForm} />
        </div>
      )}

      {/* BUTTONS */}
      <input
        type="button"
        value="Back"
        onClick={() => resetFormFields()}
        style={{
          display: changeState === NONE ? 'none' : 'block',
        }}
      />

      <input
        type="button"
        value="Change Username"
        onClick={() => toggleChangeState(USERNAME)}
        style={{
          display: changeState === NONE ? 'block' : 'none',
        }}
      />

      <input
        type="button"
        value="Change Password"
        onClick={() => toggleChangeState(PASSWORD)}
        style={{
          display: changeState === NONE ? 'block' : 'none',
        }}
      />

      <input
        type="button"
        value="Change Password Hint"
        onClick={() => toggleChangeState(PASSWORD_HINT)}
        style={{
          display: changeState === NONE ? 'block' : 'none',
        }}
      />

      <input
        type="button"
        value="Logout"
        onClick={() => {
          props.refreshCreds();
          props.setPage('login');
        }}
        style={{
          display: changeState === NONE ? 'block' : 'none',
        }}
      />
    </div>
  );
}

export default Settings;
