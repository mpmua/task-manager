const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

const db = new sqlite3.Database("./tasks.db", (err) => {
  err
    ? console.error("DB Error: ", err.message)
    : console.log("Connected to sqlite database");
});

db.run(
  `CREATE TABLE IF NOT EXISTS tasks_table (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  due TEXT NOT NULL
  )`,
  (err) => {
    err
      ? console.log("Error creating table: ", err.message)
      : console.log("Tasks table created successfully");
  }
);

app.get("/", (req, res) => {
  res.send(`API is up and running! ${req.body}`);
});

app.post("/tasks", (req, res) => {
  const { title, description, status, due } = req.body;
  db.run(
    "INSERT INTO tasks_table (title, description, status, due) VALUES (?, ?, ?, ?)",
    [title, description, status, due],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error creating task: ", err });
      }
      if (!title || !status || !due) {
        return res
          .status(400)
          .json({ error: "Title, status, and due date are required" });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        description,
        status,
        due,
      });
    }
  );
});
