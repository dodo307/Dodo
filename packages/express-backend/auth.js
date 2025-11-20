import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user.js'; // our MongoDB User model

function generateAccessToken(username) {
  // Creates a token that lasts 1 day
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: '1d',
  });
}

// SIGN UP (Create new user) 
export async function registerUser(req, res) {
  const { username, pwd } = req.body;

  // Basic input validation
  if (!username || !pwd) {
    return res.status(400).send('Missing username or password.');
  }

  // Check if the username already exists in MongoDB
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).send('Username already taken.');
  }

  // Hash the password before storing 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pwd, salt);

  // Save the new user to MongoDB
  await User.create({
    username,
    password: hashedPassword,
    tags: [], // start with empty tag list
  });

  // Create a token so user is logged in immediately after signup
  const token = generateAccessToken(username);

  // Send success response
  res.status(201).send({ token });
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

  // Verify the token is valid
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token.');

    // save username from token so other routes can use it
    req.user = decoded.username;
    next();
  });
}
