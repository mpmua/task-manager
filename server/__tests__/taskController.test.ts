import db from "../config/db.config";
import { Request, Response } from "express";
import {
  fetchAllTasks,
  createTask,
  editTask,
  deleteTask,
} from "../controllers/taskController";
import { Task } from "../../shared/types";

jest.mock("../config/db.config", () => ({
  __esModule: true,
  default: {
    all: jest.fn(),
    run: jest.fn(),
  },
}));
// jest.mock("sqlite3", () => {
//   return {
//     verbose: jest.fn().mockReturnThis(),
//     Database: jest.fn().mockImplementation(() => ({
//       all: jest.fn(),
//       run: jest.fn(),
//     })),
//   };
// });

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Test Task 1",
    description: "Testing",
    status: "In Progress",
    due: "2025-06-22",
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "Testing",
    status: "Complete",
    due: "2025-10-11",
  },
  {
    id: 3,
    title: "Test Task 3",
    description: "Testing",
    status: "Not Started",
    due: "2025-12-23",
  },
  {
    id: 4,
    title: "Test Task 4",
    description: "Testing",
    status: "In Progress",
    due: "2025-08-01",
  },
];

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

  it("should return all tasks with status 200 on success", () => {
    db.all.mockImplementation((query: string, callbackFn: Function) => {
      callbackFn(null, mockTasks);
    });

    fetchAllTasks(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ tasksList: mockTasks });
  });
});

describe("createTask", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        title: "Dummy Task",
        description: "Test",
        status: "Test",
        due: "Test",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create a task", () => {
    const mockRunResult = { lastID: 1 };
    (db.run as jest.Mock).mockImplementation(
      (query: string, params: any[], callbackFn: Function) => {
        callbackFn(mockRunResult, null);
      }
    );

    createTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      title: "Dummy Task",
      description: "Test",
      status: "Test",
      due: "Test",
    });
  });
});

describe("deleteTask", () => {
  let req: Partial<Request> = {};
  let res: Partial<Response> = {};

  beforeEach(() => {
    req = {
      params: { id: "1" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should delete a task and return status of 200 on success", () => {
    db.run.mockImplementation(
      (query: string, id: string, callback: Function) => {
        callback(null);
      }
    );

    deleteTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Task with ID of 1 deleted successfully",
    });
  });
});
