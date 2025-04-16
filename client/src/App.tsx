import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import { Task } from "./utils/types";

function App() {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [form, setForm] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "",
    due: "",
  });

  useEffect(() => {
    console.log("Form: ", form);
  }, [form]);

  const [formVisiblility, setFormVisibility] = useState(false);

  const API = "http://localhost:4000";

  const getTasks = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log("get response: ", response);
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
      console.log("RES: ", res);
      setTasksList((prev) => [...prev, res.data]);
    } catch (error) {
      console.log(`Error creating task: , ${error}`);
    }
  };

  const editTask = async (id) => {
    const taskToEdit = tasksList.filter((task) => task.id === id);
    setForm(taskToEdit[0]);
    setFormVisibility(true);
    console.log("Task to edit: ", taskToEdit);

    try {
      const editTask = axios.patch("/tasks/:id", form);
    } catch (error) {
      console.log(`Error: ${error}`);
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

  return (
    <section className="">
      {formVisiblility && (
        <TaskForm
          setFormVisibility={setFormVisibility}
          createTask={createTask}
          setForm={setForm}
          form={form}
        />
      )}
      <button
        onClick={() => {
          setFormVisibility(true);
        }}
      >
        Create Task
      </button>
      <table>
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
                      editTask(task.id);
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
  );
}

export default App;
