"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../config/db.config"));
const taskController_1 = require("../controllers/taskController");
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
const mockTasks = [
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
            callbackFn(null, mockTasks);
        });
        (0, taskController_1.fetchAllTasks)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ tasksList: mockTasks });
    });
});
describe("createTask", () => {
    let req;
    let res;
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
        db_config_1.default.run.mockImplementation((query, params, callbackFn) => {
            callbackFn(mockRunResult, null);
        });
        (0, taskController_1.createTask)(req, res);
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
        db_config_1.default.run.mockImplementation((query, id, callback) => {
            callback(null);
        });
        (0, taskController_1.deleteTask)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Task with ID of 1 deleted successfully",
        });
    });
});
