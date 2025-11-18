import express from 'express';
import cors from 'cors';
import connectMongo from './dbConnection.js';
import { registerUser, authenticateUser, loginUser } from './auth.js';
import { deleteUser, getTags, addTag, deleteTag } from './userServices.js';
import { getTasks, findTaskById, addTask, deleteTask, updateTask } from './taskServices.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

await connectMongo(); // wait for DB, then start HTTP

/* ------------------------- USER OPERATIONS ------------------------- */
/// AUTHENTICATE REGISTER NEW USER
app.post('/signup', registerUser);

/// LOGIN USER
app.post('/login', loginUser);

/// DELETE USER PROFILE
app.delete('/delete', authenticateUser, deleteUser);

/* ------------------------------------------------------------------- */

/// PLACEHOLDER HOMEPAGE GET ?????
app.get('/', (req, res) => {
  res.status(200).send('|| PLACEHOLDER ||');
});

/* ------------------------- TASK OPERATIONS ------------------------- */

/// GET ALL TASKS -- OPTIONALLY BY TAG
app.get('/tasks', (req, res) => {
  const tags = req.query.tags;
  getTasks(tags)
    .then(result => res.status(200).send(result))
    .catch(_err => res.status(404).send('Resource not found'));
});

/// GET TASK BY ID
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  findTaskById(id)
    .then(result => res.status(200).send(result))
    .catch(_err => res.status(404).send('Resource not found'));
});

/// POST NEW TASK
app.post('/tasks', (req, res) => {
  addTask(req.body)
    .then(result => res.status(201).send(result))
    .catch(_err => res.status(404).send('Unable to POST to resource'));
});

/// DELETE TASK BY ID
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  deleteTask(id)
    .then(result => res.status(201).send(result))
    .catch(_err => res.status(404).send('Resource not found'));
});

/// UPDATE TASK BY ID
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const newTask = req.query.task; /// ???????
  updateTask(id, newTask)
    .then(result => res.status(201).send(result))
    .catch(_err => res.status(404).send('Resource not found'));
});

/* ------------------------- TAG OPERATIONS -------------------------- */

/// GET TAGS FOR USER BY ID -- OPTIONALLY BY NAME
app.get('/tags/:id', (req, res) => {
  const id = req.params.id;
  getTags(id)
    .then(result => res.status(200).send(result))
    .catch(_err => res.status(404).send('Resource not found'));
});

/// ADD TAG TO USER
app.post('/tags/:tag/:id', (req, res) => {
  const id = req.params.id;
  const tag = req.params.tag;
  addTag(id, tag)
    .then(result => res.status(201).send(result))
    .catch(_err => res.status(404).send('Unable to POST to resource'));
});

/// REMOVE TAG FROM USER
app.delete('/tags/:tag/:id', (req, res) => {
  const id = req.params.id;
  const tag = req.params.tag;
  deleteTag(id, tag)
    .then(result => res.status(201).send(result))
    .catch(_err => res.status(404).send('Resource not found'));
});

/* ------------------------------------------------------------------- */

app.listen(process.env.PORT || port, () => {
  console.log('REST API is listening on port', process.env.PORT || port);
});
