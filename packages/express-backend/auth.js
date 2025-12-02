import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userExists, addUser, getHashedPassword, getPwdHint } from './userServices.js';

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
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

export function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token received');
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        next();
      } else {
        console.log('JWT error:', error);
        res.status(401).end();
      }
    });
  }
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
            generateAccessToken(username).then(async token => {
              const user = await findUserByUsername(username);

              res.status(200).send({
                token: token,
                userID: user._id,
                username: user.username,
              });
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
      return res.status(404).send('User does not exist');
    }
    return res.status(200).json({ hint: pwdHint });
  } catch (error) {
    console.error('Error in hintUser:', error);
    return res.status(500).send('Internal server error');
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
