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

  const editTask = async (id, e) => {
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

  return (
    <section className="">
      {formVisiblility && (
        <form
          onSubmit={(e) => {
            isEditing ? editTask(taskId, e) : createTask(e);
          }}
          className="absolute w-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-stone-700 rounded-2xl "
        >
          <div>
            <label htmlFor="title">
              <b>Title</b>
            </label>
            <input
              onChange={handleFormInputs}
              value={form.title}
              type="text"
              placeholder="Title"
              name="title"
              required
              className="mb-4"
            />
          </div>
          <div>
            <label htmlFor="description">
              <b>Description</b>
            </label>
            <input
              onChange={handleFormInputs}
              value={form.description}
              type="text"
              placeholder="Description"
              name="description"
              className="mb-4"
            />
          </div>
          <div>
            <label htmlFor="status">
              <b>Status</b>
            </label>
            <input
              onChange={handleFormInputs}
              value={form.status}
              type="text"
              placeholder="Status"
              name="status"
              required
              className="mb-4"
            />
          </div>
          <div>
            <label htmlFor="due">
              <b>Due Date/Time</b>
            </label>
            <input
              onChange={handleFormInputs}
              value={form.due}
              type="text"
              placeholder="Due Date/Time"
              name="due"
              required
              className="mb-4"
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
      <button
        onClick={() => {
          setFormVisibility(true);
        }}
      >
        Create Task
      </button>
      <section className="bg-[#363640] flex items-center h-full">
        <table className="">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Due Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {tasksList.map((task) => {
              return (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>{task.due}</td>
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
                      className="fa-solid fa-pen"
                    ></i>
                  </td>
                  <td>
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
