import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userExists, addUser, getHashedPassword } from './userServices.js';

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
  const { username, pwd } = req.body; // from form

  if (!username || !pwd) {
    res.status(400).send('Bad request: Invalid input data.');
  } else if (userExists(username).then(exists => exists)) {
    res.status(409).send('Username already taken');
  } else {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(pwd, salt))
      .then(hashedPassword => {
        generateAccessToken(username).then(token => {
          // console.log('Token:', token);
          addUser({ username: username, password: hashedPassword })
            .then(_ => res.status(201).send({ token: token }))
            .catch(_ => res.status(404).send('Unable to POST to resource'));
        });
      });
  }
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
  const hashedUserPassword = getHashedPassword(username).then(hashedPass => hashedPass);

  if (hashedUserPassword === '') {
    // invalid username
    res.status(401).send('Unauthorized');
  } else {
    bcrypt
      .compare(pwd, hashedUserPassword)
      .then(matched => {
        if (matched) {
          generateAccessToken(username).then(token => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send('Unauthorized');
        }
      })
      .catch(() => {
        res.status(401).send('Unauthorized');
      });
  }
}
