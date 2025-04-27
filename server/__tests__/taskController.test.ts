import db from "../config/db.config";
import { Request, Response } from "express";
import {
  fetchAllTasks,
  createTask,
  editTask,
  deleteTask,
} from "../controllers/taskController";
import { Task } from "../../shared/types";

jest.mock("../config/db.config.ts", () => ({
  __esModule: true,
  default: {
    all: jest.fn(),
    run: jest.fn(),
  },
}));

const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Test Task 1",
    description: "Testing",
    status: "In Progress",
    due: "2024-01-25T09:00",
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "Testing",
    status: "Complete",
    due: "2024-01-25T04:00",
  },
  {
    id: 3,
    title: "Test Task 3",
    description: "Testing",
    status: "Not Started",
    due: "2024-01-25T20:00",
  },
  {
    id: 4,
    title: "Test Task 4",
    description: "Testing",
    status: "In Progress",
    due: "2024-01-25T15:00",
  },
];

describe("Fetch All Tasks", () => {
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
      callbackFn(null, dummyTasks);
    });

    fetchAllTasks(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ tasksList: dummyTasks });
  });

  it("should return status 500 on failure", () => {
    db.all.mockImplementation((query: string, callbackFn: Function) => {
      callbackFn(new Error("Error fetching data from database"));
    });

    fetchAllTasks(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("Create Task", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        title: "Dummy Task",
        description: "Dummy Task Description",
        status: "Dummy Task Status",
        due: "Dummy Task Due Date/Time",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return status 201 and create a task", () => {
    const mockId = { lastID: 1 };

    db.run.mockImplementation(
      (query: string, params: any[], callbackFn: Function) => {
        callbackFn.call(mockId, null);
      }
    );

    createTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      title: "Dummy Task",
      description: "Dummy Task Description",
      status: "Dummy Task Status",
      due: "Dummy Task Due Date/Time",
    });
  });

  it("should return status 500 if there's an error creating a task", () => {
    const error = new Error("DB write failed");

    db.run.mockImplementation(
      (query: string, params: any[], callbackFn: Function) => {
        callbackFn.call({}, error);
      }
    );

    createTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Error creating task: ${error.message}`,
    });
  });
});

describe("Edit Task", () => {
  let req: Partial<Request> = {};
  let res: Partial<Response> = {};

  const editedDummyTask = {
    id: 1,
    title: "EDITED DUMMY TASK",
    description: "EDITED DUMMY TASK",
    status: "Complete",
    due: "0111-01-01T11:11",
  };

  beforeEach(() => {
    req = {
      body: editedDummyTask,
      params: { id: "1" },
    };
  });

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  it("should edit a task and return a 201 response", () => {
    db.run.mockImplementation(
      (query: string, params: any[], callbackFn: Function) => {
        callbackFn(null);
      }
    );
    editTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(editedDummyTask);
  });

  it("should return a status of 500 upon failure to edit a task", () => {
    const error = new Error("Error editing task");
    db.run.mockImplementation(
      (query: string, params: any[], callbackFn: Function) => {
        callbackFn(error);
      }
    );

    editTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Error editing task with id of 1: ${error.message}`,
    });
  });
});

describe("Delete Task", () => {
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
      (query: string, id: string, callbackFn: Function) => {
        callbackFn(null);
      }
    );

    deleteTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Task with ID of 1 deleted successfully",
    });
  });

  it("should return status of 500 when deleting a task fails", () => {
    const error = new Error("Error deleting task");
    db.run.mockImplementation(
      (query: string, id: string, callbackFn: Function) => {
        callbackFn(error);
      }
    );

    deleteTask(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Error deleting task with id of 1: ${error.message}`,
    });
  });
});
