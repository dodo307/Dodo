import express from 'express';
import cors from 'cors';
import connectMongo from './dbConnection.js';
import { registerUser, loginUser, hintUser, updateUserWithHash, authenticateUser } from './auth.js';
import { deleteUser, getTags, addTag, deleteTag, findUser } from './userServices.js';
import { getTasks, findTaskById, addTask, deleteTask, updateTask } from './taskServices.js';

const app = express();
const port = 8000;

// Split the comma-separated list coming from CORS_ALLOWED_ORIGINS and cache it up front
// so the per-request CORS check is just simple array lookups.
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // If there’s no Origin header, treat this as a trusted request. Useful for curl debugging.
    if (!origin) return callback(null, true);

    // If no env var is configured we default to allowing everything to avoid false positives.
    if (allowedOrigins.length === 0) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked by CORS policy: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

await connectMongo(); // wait for DB, then start HTTP

/* ------------------------- USER OPERATIONS ------------------------- */
/// AUTHENTICATE REGISTER NEW USER
app.post('/signup', registerUser);

/// LOGIN USER
app.post('/login', loginUser);

/// PASSWORD HINT
app.get('/hint/:username', authenticateUser, hintUser);

// GET USER BY ID OR USERNAME
app.get('/users', (req, res) => {
  const userID = req.query.userID;
  const username = req.query.username;
  findUser(userID, username)
    .then(result => res.status(200).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

// UPDATE USER BY ID
app.put('/users/:userID', authenticateUser, updateUserWithHash);

// DELETE USER BY ID
app.delete('/users/:userID', authenticateUser, (req, res) => {
  const userID = req.params.userID;
  deleteUser(userID)
    .then(result => res.status(201).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

/* ------------------------------------------------------------------- */

/// PLACEHOLDER HOMEPAGE GET ?????
app.get('/', authenticateUser, (_req, res) => {
  res.status(200).send('Page does not exist. Please verify URL');
});

/* ------------------------- TASK OPERATIONS ------------------------- */

/// GET ALL TASKS -- OPTIONALLY BY TAG
app.get('/tasks/:userID', authenticateUser, (req, res) => {
  const userID = req.params.userID;
  const tags = req.query.tags;
  getTasks(userID, tags)
    .then(result => res.status(200).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

/// GET TASK BY ID
app.get('/tasks/:taskID/:userID', authenticateUser, (req, res) => {
  const taskID = req.params.taskID;
  const userID = req.params.userID;
  findTaskById(taskID, userID)
    .then(result => res.status(200).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

/// POST NEW TASK
app.post('/tasks', authenticateUser, (req, res) => {
  addTask(req.body)
    .then(result => res.status(201).send(result))
    .catch(_ => res.status(404).send('Unable to POST to resource'));
});

/// DELETE TASK BY ID
app.delete('/tasks/:taskID/:userID', authenticateUser, (req, res) => {
  const taskID = req.params.taskID;
  const userID = req.params.userID;
  deleteTask(taskID, userID)
    .then(result => res.status(201).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

/// UPDATE TASK BY ID
app.put('/tasks/:taskID/:userID', authenticateUser, (req, res) => {
  const taskID = req.params.taskID;
  const userID = req.params.userID;
  updateTask(taskID, userID, req.body)
    .then(result => res.status(201).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

/* ------------------------- TAG OPERATIONS -------------------------- */

/// GET TAGS FOR USER BY ID -- OPTIONALLY BY NAME
app.get('/tags/:id', authenticateUser, (req, res) => {
  const id = req.params.id;
  getTags(id)
    .then(result => res.status(200).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

/// ADD TAG TO USER
app.post('/tags/:id/:tag', authenticateUser, (req, res) => {
  const id = req.params.id;
  const tag = req.params.tag;
  addTag(id, tag)
    .then(result => res.status(201).send(result))
    .catch(_ => res.status(404).send('Unable to POST to resource'));
});

/// REMOVE TAG FROM USER
app.delete('/tags/:id/:tag', authenticateUser, (req, res) => {
  const id = req.params.id;
  const tag = req.params.tag;
  deleteTag(id, tag)
    .then(result => res.status(201).send(result))
    .catch(_ => res.status(404).send('Resource not found'));
});

/* ------------------------------------------------------------------- */

app.listen(process.env.PORT || port, () => {
  console.log('REST API is listening on port', process.env.PORT || port);
});
