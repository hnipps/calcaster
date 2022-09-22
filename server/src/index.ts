import express from "express";
import dotenv from "dotenv";
import path from "path";

import run from "./run";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/run", (req, res) => {
  run();
  res.send("Running...");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
