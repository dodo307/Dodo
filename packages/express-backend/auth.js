import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  updateUser,
  userExists,
  addUser,
  getHashedPassword,
  getPwdHint,
  findUserByUsername,
} from './userServices.js';

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
                .then(user => {
                  res.status(201).send({
                    token: token,
                    userID: user._id,
                    username: user.username,
                  });
                })
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
    return res.status(400).send('Bad request: Invalid input data.');
  }

  getHashedPassword(username)
    .then(hashedPassword => bcrypt.compare(pwd, hashedPassword))
    .then(matched => {
      if (!matched) {
        return res.status(401).send('Unauthorized');
      }

      return generateAccessToken(username).then(token => {
        return findUserByUsername(username).then(user => {
          res.status(200).send({
            token: token,
            userID: user._id,
            username: user.username,
          });
        });
      });
    })
    .catch(() => {
      res.status(401).send('Unauthorized');
    });
}

// UPDATE USER (hash password here before saving)
export function updateUserController(req, res) {
  const { userID } = req.params;
  const updateData = req.body;

  // Step 1: Hash password if included
  const passwordPromise = updateData.password
    ? bcrypt.hash(updateData.password, 10).then(hashedPassword => {
        updateData.password = hashedPassword;
      })
    : Promise.resolve(); // no password to hash

  // Step 2: After hashing (or skipping), perform DB update
  passwordPromise
    .then(() => updateUser(userID, updateData))
    .then(updatedUser => {
      if (!updatedUser) {
        res.status(404).send('User not found');
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch(error => {
      console.error('Error in updateUserController:', error);
      res.status(500).send('Internal server error');
    });
}

/*Put in here for now but not sure if it falls under the authentication*/
export async function hintUser(req, res) {
  try {
    const { username } = req.params;
    const pwdHint = await getPwdHint(username);
    if (!pwdHint) {
      res.status(404).send('User does not exist');
    }
    return res.status(200).json({ hint: pwdHint });
  } catch (error) {
    console.error('Error in hintUser:', error);
    return res.status(500).send('Internal server error');
  }
}
