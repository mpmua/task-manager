"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskController_1 = require("./controllers/taskController");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
app.get("/", taskController_1.fetchAllTasks);
app.post("/tasks", taskController_1.createTask);
app.patch("/tasks/:id", taskController_1.editTask);
app.delete("/tasks/:id", taskController_1.deleteTask);
