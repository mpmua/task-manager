const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./tasks.db", (err: Error | null) => {
  if (err) {
    console.error("DB Error: ", err.message);
    process.exit(1);
  }
  // console.log("Connected to sqlite database");
});

db.run(
  `CREATE TABLE IF NOT EXISTS tasks_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    due TEXT NOT NULL
    )`,
  (err: Error | null) => {
    if (err) {
      console.error("DB Error: ", err.message);
      process.exit(1);
    }
    // console.log("Created database succesfully");
  }
);

export default db;
