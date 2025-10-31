import express from 'express';
import cors from 'cors';
import connectMongo from './dbConnection.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

await connectMongo(); // wait for DB, then start HTTP

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
