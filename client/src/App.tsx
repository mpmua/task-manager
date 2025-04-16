import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";

type task = {
  title: string;
  description: string;
  status: string;
  due: string;
};

function App() {
  const [tasksList, setTasksList] = useState<task[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    due: "",
  });

  useEffect(() => {
    console.log("Form: ", form);
  }, [form]);

  const [formVisiblility, setFormVisibility] = useState(false);

  const API = "http://localhost:4000/";

  const createTask = async (e: React.FormEvent) => {
    console.log("CREATE TASK TRIGGERED");

    e.preventDefault();
    try {
      const res = await axios.post(`${API}/tasks`, form);
      console.log("form: ", form);
    } catch (error) {
      console.log("Error creating task: ", error);
    }
  };

  return (
    <section className="">
      {formVisiblility && (
        <TaskForm
          setFormVisibility={setFormVisibility}
          createTask={createTask}
          setForm={setForm}
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
              <tr>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{task.due}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default App;
