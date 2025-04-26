import App from "../src/App";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Task } from "../../shared/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Test Task 1",
    description: "Description 1",
    status: "Not Started",
    due: "2100-04-21T10:00",
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "Description 2",
    status: "In Progress",
    due: "2100-04-22T10:00",
  },
];

const getDummyTasks = () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      tasksList: dummyTasks,
    },
  });
};

describe("Render Tasks List", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    window.alert = jest.fn();
  });

  it("renders the task list sucessfully", async () => {
    getDummyTasks();

    render(<App />);

    expect(await screen.findByText(dummyTasks[0].title)).toBeInTheDocument();
    expect(await screen.findByText(dummyTasks[1].title)).toBeInTheDocument();
  });

  it("gives an alert error when task list fails to render", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Error fetching tasks"));

    render(<App />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Error fetching tasks/i)
      );
    });
  });
});

describe("Create Tasks", () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
    window.alert = jest.fn();
  });

  const submitNewTask = () => {
    fireEvent.click(screen.getByText(/Create Task/i));
    fireEvent.change(
      screen.getByRole("textbox", { name: "TITLE (Required)" }),
      {
        target: { value: dummyTasks[0].title },
      }
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Description (Optional)" }),
      {
        target: { value: dummyTasks[0].description },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Status (Required)" }),
      {
        target: { value: dummyTasks[0].status },
      }
    );

    fireEvent.change(screen.getByLabelText(/due/i), {
      target: { value: dummyTasks[0].due },
    });

    fireEvent.click(screen.getByText(/Submit/i));
  };

  it("handles task creation sucessfully", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: dummyTasks[0] });

    render(<App />);

    submitNewTask();

    expect(await screen.findByText(dummyTasks[0].title)).toBeInTheDocument();
  });

  it("gives an alert error upon failure to create a task", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Error creating task"));

    render(<App />);

    submitNewTask();

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Error fetching tasks/i)
      );
    });
  });
});

describe("Edit Tasks", () => {
  beforeEach(() => {
    mockedAxios.patch.mockClear();
    window.alert = jest.fn();
  });

  const editedTask: Task = {
    id: 1,
    title: "Test Task 1 - Edited",
    description: "Edited Description",
    status: "Complete",
    due: "2100-01-25T09:00",
  };

  const submitEditedTask = () => {
    fireEvent.click(screen.getAllByRole("button", { name: /Edit Task/i })[0]);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: editedTask.title },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: editedTask.description },
    });

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: editedTask.status },
    });

    fireEvent.change(screen.getByLabelText(/due/i), {
      target: { value: editedTask.due },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  };

  it("handles editing a task sucessfully", async () => {
    getDummyTasks();

    mockedAxios.patch.mockResolvedValueOnce({ data: editedTask });

    render(<App />);

    await screen.findByText(dummyTasks[0].title);
    submitEditedTask();

    await waitFor(() => expect(mockedAxios.patch).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(editedTask.title)).toBeInTheDocument();
  });

  it("gives an alert error upon failure to edit a task", async () => {
    getDummyTasks();
    mockedAxios.patch.mockRejectedValueOnce(new Error("Error editing task:"));

    render(<App />);

    await screen.findByText(dummyTasks[0].title);

    submitEditedTask();

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Error Editing Task/i)
      )
    );
  });
});

describe("Deletes a task", () => {
  beforeEach(() => {
    mockedAxios.delete.mockClear();
    window.alert = jest.fn();
  });

  it("handles a task being deleted", async () => {
    window.confirm = jest.fn().mockReturnValue(true);

    getDummyTasks();

    render(<App />);

    expect(await screen.findByText(dummyTasks[0].title)).toBeInTheDocument();

    mockedAxios.delete.mockResolvedValueOnce(dummyTasks[1]);

    fireEvent.click(screen.getAllByRole("button", { name: /Delete Task/i })[1]);
    expect(await screen.findByText(dummyTasks[0].title));
    await waitFor(() =>
      expect(screen.queryByText("Test Task 2")).not.toBeInTheDocument()
    );
  });

  it("gives an alert error upon failure to delete a task", async () => {
    getDummyTasks();

    mockedAxios.delete.mockRejectedValueOnce(new Error("Error deleting task"));

    render(<App />);

    expect(await screen.findByText(dummyTasks[0].title)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /Delete Task/i })[1]);

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Error deleting task/i)
      )
    );
  });
});
