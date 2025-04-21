"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./tasks.db", (err) => {
    if (err) {
        console.error("DB Error: ", err.message);
        process.exit(1);
    }
    // console.log("Connected to sqlite database");
});
db.run(`CREATE TABLE IF NOT EXISTS tasks_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    due TEXT NOT NULL
    )`, (err) => {
    if (err) {
        console.error("DB Error: ", err.message);
        process.exit(1);
    }
    // console.log("Created database succesfully");
});
exports.default = db;
