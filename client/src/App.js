"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
function App() {
    const [tasksList, setTasksList] = (0, react_1.useState)([]);
    const [formVisiblility, setFormVisibility] = (0, react_1.useState)(false);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [taskId, setTaskId] = (0, react_1.useState)();
    const defaultFormState = {
        id: 0,
        title: "",
        description: "",
        status: "",
        due: "",
    };
    const [formData, setFormData] = (0, react_1.useState)(defaultFormState);
    const API = "http://localhost:4000";
    const getTasks = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${API}/`);
            setTasksList(response.data.tasksList);
        }
        catch (error) {
            alert(`Error fetching tasks: ${error}`);
        }
    });
    (0, react_1.useEffect)(() => {
        const fetchTasks = () => __awaiter(this, void 0, void 0, function* () {
            yield getTasks();
        });
        fetchTasks();
    }, []);
    const createTask = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            const res = yield axios_1.default.post(`${API}/tasks`, formData);
            setTasksList((prev) => [...prev, res.data]);
        }
        catch (error) {
            alert(`Error creating task: , ${error}`);
        }
        finally {
            setFormVisibility(false);
            setFormData(defaultFormState);
        }
    });
    const editTask = (id, e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            const { data: editedTask } = yield axios_1.default.patch(`${API}/tasks/${id}`, formData);
            setTasksList((prev) => prev.map((item) => item.id === parseInt(editedTask.id) ? editedTask : item));
        }
        catch (error) {
            alert(`Error editing task: , ${error}`);
        }
        finally {
            setTaskId(null);
            setIsEditing(false);
            setFormVisibility(false);
            setFormData(defaultFormState);
        }
    });
    const deleteTask = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield axios_1.default.delete(`${API}/tasks/${id}`);
            setTasksList((prev) => prev.filter((task) => task.id !== id));
        }
        catch (error) {
            alert(`Error deleting task: , ${error}`);
        }
    });
    const handleFormInputs = (e) => {
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [e.target.name]: e.target.value })));
    };
    const inputStyles = "py-2 pl-3 mb-4 transition border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
    return (<section className="flex flex-col justify-center items-center text-[#e4edfc] mt-[10vh]">
      {formVisiblility && (<form onSubmit={(e) => {
                isEditing ? editTask(taskId, e) : createTask(e);
            }} className="absolute w-1/2 p-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-2xl">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="title">
              <b>TITLE (Required)</b>
            </label>
            <input className={inputStyles} onChange={handleFormInputs} value={formData.title} type="text" placeholder="Title" name="title" required/>
          </div>
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="description">
              <b>Description (Optional)</b>
            </label>
            <input className={inputStyles} onChange={handleFormInputs} value={formData.description} type="text" placeholder="Description" name="description"/>
          </div>
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="status">
              <b>Status (Required)</b>
            </label>
            <select name="status" className={inputStyles} value={formData.status} onChange={handleFormInputs} required>
              <option value="" disabled>
                -- Please select an option --
              </option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="due">
              <b>Due Date/Time (Required)</b>
            </label>
            <input type="datetime-local" className={inputStyles} onChange={handleFormInputs} value={formData.due} placeholder="Due Date/Time" name="due" required/>
          </div>
          <section className="text-right">
            <button className="mr-4">Submit</button>
            <button onClick={() => {
                setFormVisibility(false);
                setFormData(defaultFormState);
            }}>
              Cancel
            </button>
          </section>
        </form>)}

      <section className="flex flex-col w-10/12 max-w-3xl">
        <button className="self-end w-1/4 p-2 mt-2 text-white bg-blue-600 rounded-lg" onClick={() => {
            setFormVisibility(true);
        }}>
          Create Task
        </button>
        <table className="mt-5 text-center">
          <thead>
            <tr className="text-sm">
              <th className="w-1/6">TITLE</th>
              <th className="w-2/6">DESCRIPTION</th>
              <th className="w-1/6">STATUS</th>
              <th className="w-1/6">DUE</th>
              <th className="w-1/6"></th>
            </tr>
          </thead>
          <tbody>
            {tasksList.map((task) => {
            return (<tr className="border-b border-stone-700" key={task.id}>
                  <td className="">{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <div className={`w-2/3 p-2 mx-auto rounded-2xl ${task.status === "Complete"
                    ? "bg-green-200 text-green-800"
                    : task.status === "Not Started"
                        ? "bg-yellow-200 text-yellow-800"
                        : task.status === "In Progress"
                            ? "bg-amber-200 text-amber-800"
                            : "bg-transparent"}`}>
                      {task.status}
                    </div>
                  </td>
                  <td className="rounded-md">{task.due}</td>
                  <td>
                    <i role="button" tabIndex={0} onClick={() => {
                    setFormData({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        due: task.due,
                    });
                    setFormVisibility(true);
                    setIsEditing(true);
                    setTaskId(task.id);
                }} className="pr-5 fa-solid fa-pen"></i>
                    <i role="button" tabIndex={0} onClick={() => {
                    const userChoice = confirm("Delete Task?");
                    if (userChoice)
                        deleteTask(task.id);
                }} className="fa-solid fa-trash"></i>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </section>
    </section>);
}
exports.default = App;
