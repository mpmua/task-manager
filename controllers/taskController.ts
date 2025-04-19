import * as sqlite3 from "sqlite3";
import { Request, Response } from "express";
import { Task } from "../shared/types";
import { db } from "../config/db.config";

export const fetchAllTasks = (req: Request, res: Response) => {
  db.all("SELECT * FROM tasks_table", (err: Error | null, rows: Task[]) => {
    if (err) {
      return res
        .status(500)
        .json({ error: `Error fetching data from DB: ${err.message}` });
    }
    res.status(200).json({ tasksList: rows });
  });
};

export const createTask = (req: Request, res: Response) => {
  const { title, description, status, due } = req.body;

  db.run(
    "INSERT INTO tasks_table (title, description, status, due) VALUES (?, ?, ?, ?)",
    [title, description, status, due],
    function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        return res.status(500).json({
          error: `Error creating task: ${err.message}`,
        });
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
};

export const editTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, due } = req.body;
  const sqlStmnt =
    "UPDATE tasks_table SET title = ?, description = ?, status = ?, due = ? WHERE id = ?";
  db.run(
    sqlStmnt,
    [title, description, status, due, id],
    function (err: Error | null) {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error editing task with id ${id}: ${err.message}` });
      }

      res.status(201).json({
        id,
        title,
        description,
        status,
        due,
      });
    }
  );
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  db.run(
    "DELETE FROM tasks_table WHERE id = ?",
    id,
    function (err: Error | null) {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error deleting task: ${err.message}` });
      }
      res.status(200).json({
        success: true,
        message: `Task with ID of ${id} deleted successfully`,
      });
    }
  );
};
