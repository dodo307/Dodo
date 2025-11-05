import { useState } from 'react';

function ForgotPassword(props) {
    const [username, setUsername] = useState('');
    const [hint, setHint] = useState('');

    // setup backend api endpoints

    return (
        <div id= "forgotPassword">
            <form>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Value"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />
                <button type="submit">Get Hint</button>

                {hint && <p>{hint}</p>}

                <button type="button" onClick={() => props.setPage('login')}>
                    Back to Login
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;