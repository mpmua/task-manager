import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "../../shared/types";

function App() {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [formVisiblility, setFormVisibility] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState<number | null>(null);

  const defaultFormState: Task = {
    id: 0,
    title: "",
    description: "",
    status: "",
    due: "",
  };
  const [formData, setFormData] = useState(defaultFormState);

  const API = "http://localhost:4000";

  const getTasks = async () => {
    try {
      const response = await axios.get(`${API}/`);
      setTasksList(response.data.tasksList);
    } catch (error) {
      alert(`Error fetching tasks: ${error}`);
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
      const res = await axios.post(`${API}/tasks`, formData);
      setTasksList((prev) => [...prev, res.data]);
    } catch (error) {
      alert(`Error creating task: , ${error}`);
    } finally {
      setFormVisibility(false);
      setFormData(defaultFormState);
    }
  };

  const editTask = async (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: editedTask } = await axios.patch(
        `${API}/tasks/${id}`,
        formData
      );

      setTasksList((prev) =>
        prev.map((item) => (item.id === editedTask.id ? editedTask : item))
      );
    } catch (error) {
      alert(`Error editing task: , ${error}`);
    } finally {
      setTaskId(null);
      setIsEditing(false);
      setFormVisibility(false);
      setFormData(defaultFormState);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API}/tasks/${id}`);
      setTasksList((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      alert(`Error deleting task: , ${error}`);
    }
  };

  const handleFormInputs = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputStyles =
    "py-2 pl-3 mb-4 transition border border-gray-400 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  // "border border-gray-500 focus:border-gray-900 py-2 pl-3 mb-4 transition border border-gray-300 rounded-md";

  return (
    <section className="flex flex-col justify-center items-center text-[#e4edfc] mt-[10vh]">
      {formVisiblility && (
        <form
          onSubmit={(e) => {
            if (!isEditing) {
              createTask(e);
            } else if (isEditing && taskId) {
              editTask(taskId, e);
            }
          }}
          className="shadow-2xl shadow-gray-800/10 z-10 absolute text-[#3b3b3b] w-2/3 p-10 transform -translate-x-1/2 -translate-y-1/2 bg-[#cbcbcb] top-1/2 left-1/2 rounded-2xl"
        >
          <div className="flex flex-col text-sm">
            <label className="mb-1" htmlFor="title">
              <b>TITLE (Required)</b>
            </label>
            <input
              id="title"
              name="title"
              className={inputStyles}
              onChange={handleFormInputs}
              value={formData.title}
              type="text"
              placeholder="Title"
              required
            />
          </div>
          <div className="flex flex-col text-sm">
            <label className="mb-1" htmlFor="description">
              <b>Description (Optional)</b>
            </label>
            <textarea
              id="description"
              name="description"
              className={inputStyles}
              onChange={handleFormInputs}
              value={formData.description ?? ""}
              placeholder="Description"
              rows={4}
            ></textarea>
          </div>
          <section className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-col text-sm">
              <label className="mb-1" htmlFor="status">
                <b>Status (Required)</b>
              </label>
              <select
                id="status"
                name="status"
                className={inputStyles}
                value={formData.status}
                onChange={handleFormInputs}
                required
              >
                <option value="" disabled>
                  -- Please select an option --
                </option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div className="flex flex-col text-sm">
              <label className="mb-1" htmlFor="due">
                <b>Due Date/Time (Required)</b>
              </label>
              <input
                id="due"
                name="due"
                type="datetime-local"
                className={inputStyles}
                onChange={handleFormInputs}
                value={formData.due}
                placeholder="Due Date/Time"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          </section>
          <section className="text-right">
            <button className="mr-4">Submit</button>
            <button
              onClick={() => {
                setFormVisibility(false);
                setFormData(defaultFormState);
              }}
            >
              Cancel
            </button>
          </section>
        </form>
      )}

      <section className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-[#2c2c2c] font-semibold text-3xl">Tasks</h1>
          <button
            className="px-4 py-2 text-white bg-blue-700 rounded-lg create-task-btn"
            onClick={() => {
              setFormVisibility(true);
            }}
          >
            Create Task
          </button>
        </div>
        <section className="overflow-x-auto">
          {tasksList.length === 0 && (
            <p className="absolute text-2xl text-center text-gray-500 -translate-x-1/2 left-1/2 top-1/2">
              You don’t have any tasks yet.
            </p>
          )}
          <table className="w-full mt-5 text-center table-fixed bg-[#ffffff] rounded-lg">
            <thead>
              <tr className="text-sm text-[#717171]">
                <th className="w-1/6">TITLE</th>
                <th className="w-2/6">DESCRIPTION</th>
                <th className="w-1/6">STATUS</th>
                <th className="w-1/6">DUE</th>
                <th className="w-1/6"></th>
              </tr>
            </thead>
            <tbody className="text-[#0f0f0f]">
              {tasksList.map((task) => (
                <tr className="border-b border-stone-200" key={task.id}>
                  <td className="px-2 overflow-hidden truncate whitespace-nowrap">
                    {task.title}
                  </td>
                  <td className="px-2 overflow-hidden truncate whitespace-nowrap">
                    {task.description}
                  </td>
                  <td className="px-2 overflow-hidden truncate whitespace-nowrap">
                    <p
                      className={`p-1 rounded-md whitespace-nowrap ${
                        task.status === "Complete"
                          ? "bg-[#afefbb] text-[#00a221]"
                          : task.status === "Not Started"
                          ? "bg-[#edc694] text-[#9a5609]"
                          : task.status === "In Progress"
                          ? "bg-[#cddaff] text-[#007dff]"
                          : "bg-transparent"
                      }`}
                    >
                      {task.status}
                    </p>
                  </td>
                  <td className="rounded-md">
                    {new Date(task.due).toLocaleString().replace(",", "")}
                  </td>
                  <td>
                    <i
                      role="button"
                      aria-label="Edit Task"
                      onClick={() => {
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
                      }}
                      className="pr-5 fa-solid fa-pen"
                    ></i>
                    <i
                      role="button"
                      aria-label="Delete Task"
                      onClick={() => {
                        const userChoice = confirm("Delete Task?");
                        if (userChoice) deleteTask(task.id);
                      }}
                      className="fa-solid fa-trash"
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
}

export default App;
