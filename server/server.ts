import {
  fetchAllTasks,
  createTask,
  editTask,
  deleteTask,
} from "./controllers/taskController";

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

app.get("/", fetchAllTasks);
app.post("/tasks", createTask);
app.patch("/tasks/:id", editTask);
app.delete("/tasks/:id", deleteTask);
