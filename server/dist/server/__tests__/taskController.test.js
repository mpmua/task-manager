"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("../config/db.config.ts", () => ({
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
const db_config_1 = __importDefault(require("../config/db.config"));
const taskController_1 = require("../controllers/taskController");
beforeEach(() => {
    jest.clearAllMocks();
});
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
        // expect(res).toHaveBeenCalled();
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({ tasksList: mockTasks });
    });
});
// describe("createTask", () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   beforeEach(() => {
//     req = {
//       body: {
//         title: "Dummy Task",
//         description: "Test",
//         status: "Test",
//         due: "Test",
//       },
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });
//   it("should create a task", () => {
//     const mockRunResult = { lastID: 1 };
//     (db.run as jest.Mock).mockImplementation(
//       (query: string, params: any[], callbackFn: Function) => {
//         callbackFn(mockRunResult, null);
//       }
//     );
//     createTask(req as Request, res as Response);
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({
//       id: 1,
//       title: "Dummy Task",
//       description: "Test",
//       status: "Test",
//       due: "Test",
//     });
//   });
// });
// describe("deleteTask", () => {
//   let req: Partial<Request> = {};
//   let res: Partial<Response> = {};
//   beforeEach(() => {
//     req = {
//       params: { id: "1" },
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });
//   it("should delete a task and return status of 200 on success", () => {
//     db.run.mockImplementation(
//       (query: string, id: string, callback: Function) => {
//         callback(null);
//       }
//     );
//     deleteTask(req as Request, res as Response);
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: "Task with ID of 1 deleted successfully",
//     });
//   });
// });
