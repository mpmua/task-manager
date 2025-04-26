"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.editTask = exports.createTask = exports.fetchAllTasks = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const fetchAllTasks = (req, res) => {
    db_config_1.default.all("SELECT * FROM tasks_table", (err, rows) => {
        if (err) {
            return res
                .status(500)
                .json({ error: `Error fetching data from DB: ${err.message}` });
        }
        res.status(200).json({ tasksList: rows });
    });
};
exports.fetchAllTasks = fetchAllTasks;
const createTask = (req, res) => {
    const { title, description, status, due } = req.body;
    db_config_1.default.run("INSERT INTO tasks_table (title, description, status, due) VALUES (?, ?, ?, ?)", [title, description, status, due], function (err) {
        if (err) {
            return res.status(500).json({
                error: `Error creating task: ${err.message}`,
            });
        }
        res.status(201).json({
            id: Number(this.lastID),
            title,
            description,
            status,
            due,
        });
    });
};
exports.createTask = createTask;
const editTask = (req, res) => {
    // console.log("REQUEST ON SERVER: ", req.body);
    // console.log("PARAMS ON SERVER: ", req.params);
    const { id } = req.params;
    const { title, description, status, due } = req.body;
    const sqlStmnt = "UPDATE tasks_table SET title = ?, description = ?, status = ?, due = ? WHERE id = ?";
    db_config_1.default.run(sqlStmnt, [title, description, status, due, id], function (err) {
        if (err) {
            return res.status(500).json({
                error: `Error editing task with id of ${id}: ${err.message}`,
            });
        }
        res.status(201).json({
            id: Number(id),
            title,
            description,
            status,
            due,
        });
    });
};
exports.editTask = editTask;
const deleteTask = (req, res) => {
    const { id } = req.params;
    db_config_1.default.run("DELETE FROM tasks_table WHERE id = ?", id, function (err) {
        if (err) {
            return res
                .status(500)
                .json({ error: `Error deleting task: ${err.message}` });
        }
        res.status(200).json({
            success: true,
            message: `Task with ID of ${id} deleted successfully`,
        });
    });
};
exports.deleteTask = deleteTask;
