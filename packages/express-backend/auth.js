import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userExists, addUser, getHashedPassword, getPwdHint } from './userServices.js';

function generateAccessToken(username) {
  // Creates a token that lasts 1 day
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: '1d',
  });
}

export function registerUser(req, res) {
  const { username, pwd, pwdHint } = req.body; // from form

  if (!username || !pwd || !pwdHint) {
    res.status(400).send('Bad request: Invalid input data.');
  } else
    userExists(username).then(exists => {
      if (exists) {
        res.status(409).send('Username already taken');
      } else {
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(pwd, salt))
          .then(hashedPassword => {
            generateAccessToken(username).then(token => {
              // console.log('Token:', token);
              addUser({ username: username, password: hashedPassword, pwdHint: pwdHint })
                .then(_ => res.status(201).send({ token: token }))
                .catch(_ => res.status(404).send('Unable to POST to resource'));
            });
          });
      }
    });
}

// LOGIN (Check username + password)
export async function loginUser(req, res) {
  const { username, pwd } = req.body;

  // Look up the user in MongoDB
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send('Unauthorized: wrong username or password.');
  }

  // Compare password with hashed password in the database
  const passwordMatch = await bcrypt.compare(pwd, user.password);
  if (!passwordMatch) {
    return res.status(401).send('Unauthorized: wrong username or password.');
  }

  // Make a token so the user stays logged in
  const token = generateAccessToken(username);

  res.status(200).send({ token });
}

//  AUTH MIDDLEWARE (Protect routes)
export function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // get the actual token part

  if (!token) {
    return res.status(401).send('No token provided.');
  }

export function loginUser(req, res) {
  const { username, pwd } = req.body; // from form

  if (!username || !pwd) {
    res.status(400).send('Bad request: Invalid input data.');
  } else {
    getHashedPassword(username).then(hashedPassword => {
      bcrypt
        .compare(pwd, hashedPassword)
        .then(matched => {
          if (matched) {
            generateAccessToken(username).then(token => {
              res.status(200).send({ token: token });
            });
          } else {
            res.status(401).send('Unauthorized');
          }
        })
        .catch(() => {
          res.status(401).send('Unauthorized');
        });
    });
  }
}

/*Put in here for now but not sure if it falls under the authentication*/
export async function hintUser(req, res) {
  try {
    const { username } = req.params;
    const pwdHint = await getPwdHint(username);
    if (!pwdHint) {
      res.status(404).send('User does not exist');
    }
    res.status(200).json({ hint: pwdHint });
  } catch (error) {
    console.error('Error in hintUser:', error);
    return res.status(500).send('Internal server error');
  }
}
