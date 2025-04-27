"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../config/db.config"));
const taskController_1 = require("../controllers/taskController");
jest.mock("../config/db.config.ts", () => ({
    __esModule: true,
    default: {
        all: jest.fn(),
        run: jest.fn(),
    },
}));
const dummyTasks = [
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
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it("should return all tasks with status 200 on success", () => {
        db_config_1.default.all.mockImplementation((query, callbackFn) => {
            callbackFn(null, dummyTasks);
        });
        (0, taskController_1.fetchAllTasks)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ tasksList: dummyTasks });
    });
    it("should return status 500 on failure", () => {
        db_config_1.default.all.mockImplementation((query, callbackFn) => {
            callbackFn(new Error("Error fetching data from database"));
        });
        (0, taskController_1.fetchAllTasks)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
describe("Create Task", () => {
    let req;
    let res;
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
        db_config_1.default.run.mockImplementation((query, params, callbackFn) => {
            callbackFn.call(mockId, null);
        });
        (0, taskController_1.createTask)(req, res);
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
        db_config_1.default.run.mockImplementation((query, params, callbackFn) => {
            callbackFn.call({}, error);
        });
        (0, taskController_1.createTask)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: `Error creating task: ${error.message}`,
        });
    });
});
describe("Edit Task", () => {
    let req = {};
    let res = {};
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
        db_config_1.default.run.mockImplementation((query, params, callbackFn) => {
            callbackFn(null);
        });
        (0, taskController_1.editTask)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(editedDummyTask);
    });
    it("should return a status of 500 upon failure to edit a task", () => {
        const error = new Error("Error editing task");
        db_config_1.default.run.mockImplementation((query, params, callbackFn) => {
            callbackFn(error);
        });
        (0, taskController_1.editTask)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: `Error editing task with id of 1: ${error.message}`,
        });
    });
});
describe("Delete Task", () => {
    let req = {};
    let res = {};
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
        db_config_1.default.run.mockImplementation((query, id, callbackFn) => {
            callbackFn(null);
        });
        (0, taskController_1.deleteTask)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Task with ID of 1 deleted successfully",
        });
    });
    it("should return status of 500 when deleting a task fails", () => {
        const error = new Error("Error deleting task");
        db_config_1.default.run.mockImplementation((query, id, callbackFn) => {
            callbackFn(error);
        });
        (0, taskController_1.deleteTask)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: `Error deleting task with id of 1: ${error.message}`,
        });
    });
});
