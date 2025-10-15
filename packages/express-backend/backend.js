// backend.js
import express from "express";
import cors from "cors";
import runMongo from "./dbConnection.js"

const app = express();
const port = 8000;

app.use(cors())
app.use(express.json());

runMongo();

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
