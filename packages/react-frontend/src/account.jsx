// import { useState } from 'react';

function Account(props) {
  return (
    <div id="accountDropdown" className="window">
      <h1>Account</h1>
      <label>Username{props.username}</label>
      <input type="button" value="Edit Account" onClick={() => props.setPage('settings')} />
    </div>
  );
}

export default Account;
