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
  if (err) {
    console.error("DB Error: ", err.message);
    process.exit(1);
  }
  console.log("Connected to sqlite database");
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
    if (err) {
      console.error("DB Error: ", err.message);
      process.exit(1);
    }
    console.log("Created database succesfully");
  }
);

app.get("/", (req, res) => {
  console.log("HERE");
  db.all("SELECT * FROM tasks_table", (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: `Error fetching data from DB: ${err}` });
    }

    res.status(200).json({ tasksList: rows });
  });
});

app.post("/tasks", (req, res) => {
  const { title, description, status, due } = req.body;
  console.log(title, description, status, due);

  db.run(
    "INSERT INTO tasks_table (title, description, status, due) VALUES (?, ?, ?, ?)",
    [title, description, status, due],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error creating task: ${err.message}` });
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
