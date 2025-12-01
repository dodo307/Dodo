// import { useState } from 'react';

function Settings(props) {
  return (
    <div id="Settings" className="window">
      <h1>Settings</h1>
      <label>Username{props.username}</label>
      <label>Change Password?</label>
      <label>Change Password Hint?</label>
    </div>
  );
}

export default Settings;
