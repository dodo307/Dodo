import { useEffect, useRef } from 'react';

function Account(props) {
  const boxRef = useRef(null);

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

  return (
    <div id="accountDropdown" className="window" ref={boxRef}>
      {/* Cross to exit window on click */}
      <div id="cross" onClick={() => props.setPage('main')}>
        &#10005;
      </div>
      <h1>Account</h1>
      <label>
        Username: <span className="username-display">{props.username}</span>
      </label>
      <input type="button" value="Edit Account" onClick={() => props.setPage('settings')} />
      <input
        type="button"
        value="Logout"
        onClick={() => {
          // On logout, reset credentials and go back to login
          props.refreshCreds();
          props.setPage('login');
        }}
      />
    </div>
  );
}

export default Account;
