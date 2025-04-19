import db from "../config/db.config";
import { Request, Response } from "express";
import {
  fetchAllTasks,
  createTask,
  editTask,
  deleteTask,
} from "../controllers/taskController";
import { Task } from "../shared/types";

jest.mock("../config/db.config", () => ({
  __esModule: true,
  default: {
    all: jest.fn(),
  },
}));

describe("fetchAllTasks", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return tasks with status 200 on success", () => {
    console.log("DB MOCK:", db);
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Test Task",
        description: "Testing",
        status: "In Progress",
        due: "2025-04-19",
      },
    ];

    db.all.mockImplementation((query: string, callback: Function) => {
      callback(null, mockTasks);
    });

    fetchAllTasks(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ tasksList: mockTasks });
  });
});

// it("should return error with status 500 on db failure", () => {
//   const mockError = new Error("DB failure");

//   // @ts-ignore - override the mock
//   db.all.mockImplementation((query: string, callback: Function) => {
//     callback(mockError, null);
//   });

//   fetchAllTasks(req as Request, res as Response);

//   expect(res.status).toHaveBeenCalledWith(500);
//   expect(res.json).toHaveBeenCalledWith({
//     error: `Error fetching data from DB: ${mockError.message}`,
//   });
// });
