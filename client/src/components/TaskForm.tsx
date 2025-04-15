import { useState } from "react";

interface TaskFormProps {
  setFormVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  createTask: (e: React.FormEvent) => Promise<void>;
  setForm: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      status: string;
      due: string;
    }>
  >;
}

const TaskForm = ({
  setFormVisibility,
  createTask,
  setForm,
}: TaskFormProps) => {
  return (
    <>
      {" "}
      <form
        onSubmit={createTask}
        className="w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-stone-700 rounded-2xl "
      >
        <div>
          <label htmlFor="title">
            <b>Title</b>
          </label>
          <input
            onChange={(e) => {
              setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
            }}
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
            type="text"
            placeholder="Due Date/Time"
            name="due"
            required
            className="mb-4"
          />
        </div>
        <section className="text-right">
          <button
            // onClick={createTask}
            className="mr-4"
          >
            Submit
          </button>
          <button
            onClick={() => {
              setFormVisibility(false);
            }}
          >
            Cancel
          </button>
        </section>
      </form>
    </>
  );
};

export default TaskForm;
