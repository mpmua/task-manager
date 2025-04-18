import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import { Task } from "./utils/types";

function App() {
  const [tasksList, setTasksList] = useState<Task[]>([]);

  const defaultFormState: Task = {
    id: 0,
    title: "",
    description: "",
    status: "",
    due: "",
  };
  const [form, setForm] = useState(defaultFormState);

  const [formVisiblility, setFormVisibility] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState<number | null>();

  const API = "http://localhost:4000";

  const getTasks = async () => {
    try {
      const response = await axios.get(`${API}/`);
      setTasksList(response.data.tasksList);
    } catch (error) {
      console.log(`Error fetching tasks: ${error}`);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      await getTasks();
    };
    fetchTasks();
  }, []);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<Task>(`${API}/tasks`, form);
      setTasksList((prev) => [...prev, res.data]);
    } catch (error) {
      console.log(`Error creating task: , ${error}`);
    } finally {
      setFormVisibility(false);
      setForm(defaultFormState);
    }
  };

  const editTask = async (id: number, e) => {
    e.preventDefault();

    try {
      axios.patch(`${API}/tasks/${id}`, form);
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setTaskId(null);
      setIsEditing(false);
      setFormVisibility(false);
      setForm(defaultFormState);
    }
  };

  const deleteTask = async (id) => {
    try {
      const deleteTask = await axios.delete(`${API}/tasks/${id}`);
      console.log("Delete task: ", deleteTask);
      setTasksList((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const handleFormInputs = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputStyles =
    "py-2 pl-3 mb-4 transition border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  return (
    <section className="bg-[#141e2f] flex flex-col justify-center items-center text-[#e4edfc] mt-[10vh]">
      {formVisiblility && (
        <form
          onSubmit={(e) => {
            isEditing ? editTask(taskId, e) : createTask(e);
          }}
          className="absolute w-1/2 p-10 transform -translate-x-1/2 -translate-y-1/2 bg-stone-800 top-1/2 left-1/2 rounded-2xl "
        >
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="title">
              <b>TITLE (Required)</b>
            </label>
            <input
              className={inputStyles}
              onChange={handleFormInputs}
              value={form.title}
              type="text"
              placeholder="Title"
              name="title"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="description">
              <b>Description (Optional)</b>
            </label>
            <input
              className={inputStyles}
              onChange={handleFormInputs}
              value={form.description}
              type="text"
              placeholder="Description"
              name="description"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="status">
              <b>Status (Required)</b>
            </label>
            <select
              name="status"
              className={inputStyles}
              value={form.status}
              onChange={handleFormInputs}
              required
            >
              <option value="" disabled>
                -- Please select an option --
              </option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="due">
              <b>Due Date/Time (Required)</b>
            </label>
            <input
              type="datetime-local"
              className={inputStyles}
              onChange={handleFormInputs}
              value={form.due}
              placeholder="Due Date/Time"
              name="due"
              required
            />
          </div>
          <section className="text-right">
            <button className="mr-4">Submit</button>
            <button
              onClick={() => {
                setFormVisibility(false);
                setForm(defaultFormState);
              }}
            >
              Cancel
            </button>
          </section>
        </form>
      )}

      <section className="flex flex-col w-10/12 max-w-3xl">
        <button
          className="self-end w-1/4 p-2 mt-2 text-white bg-blue-600 rounded-lg"
          onClick={() => {
            setFormVisibility(true);
          }}
        >
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
              return (
                <tr className="border-b border-stone-700" key={task.id}>
                  <td className="">{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>
                    <div
                      style={{
                        backgroundColor:
                          task.status === "Complete"
                            ? "green"
                            : task.status === "Pending"
                            ? "yellow"
                            : task.status === "In Progress"
                            ? "amber"
                            : "transparent",
                      }}
                      className="rounded-md "
                    >
                      {task.due}
                    </div>
                  </td>
                  <td>
                    <i
                      onClick={() => {
                        setForm({
                          id: task.id,
                          title: task.title,
                          description: task.description,
                          status: task.status,
                          due: task.due,
                        });
                        setFormVisibility(true);
                        setIsEditing(true);
                        setTaskId(task.id);
                      }}
                      className="pr-5 fa-solid fa-pen"
                    ></i>
                    <i
                      onClick={() => {
                        deleteTask(task.id);
                      }}
                      className="fa-solid fa-trash"
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </section>
  );
}

export default App;
