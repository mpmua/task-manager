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
    due: "2025-04-21T10:00",
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "Description 2",
    status: "In Progress",
    due: "2025-04-22T10:00",
  },
];

const getDummyTasks = () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      tasksList: dummyTasks,
    },
  });
};

describe("App Component", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();
    mockedAxios.patch.mockClear();
    mockedAxios.delete.mockClear();
    window.alert = jest.fn();
  });

  it("renders the task list", async () => {
    getDummyTasks();

    render(<App />);

    expect(await screen.findByText("Test Task 1")).toBeInTheDocument();
    expect(await screen.findByText("Test Task 2")).toBeInTheDocument();
  });

  it("handles task creation", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: dummyTasks[0] });

    render(<App />);

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

    expect(await screen.findByText(dummyTasks[0].title)).toBeInTheDocument();
  });

  it("handles editing a task and returns", async () => {
    getDummyTasks();

    const dummyTask = dummyTasks[0];

    const editedTask: Task = {
      id: 1,
      title: "Test Task 1 - Edited",
      description: "Edited Description",
      status: "Complete",
      due: "2024-01-25T09:00",
    };

    mockedAxios.patch.mockResolvedValueOnce({ data: editedTask });

    render(<App />);

    await screen.findByText(dummyTask.title);

    fireEvent.click(screen.getAllByRole("button", { name: /Edit Task/i })[0]);

    await screen.findByDisplayValue(dummyTask.title);

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

    await waitFor(() => expect(mockedAxios.patch).toHaveBeenCalledTimes(1));

    expect(await screen.findByText(editedTask.title)).toBeInTheDocument();
  });

  it("handles a task being deleted", async () => {
    window.confirm = jest.fn().mockReturnValue(true);

    getDummyTasks();

    render(<App />);

    await waitFor(() => screen.getByText("Test Task 1"));

    const deleteBtns = screen.getAllByRole("button", { name: /Delete Task/i });

    mockedAxios.delete.mockResolvedValueOnce({
      id: 2,
      title: "Test Task 2",
      description: "Description 2",
      status: "In Progress",
      due: "2025-04-22T10:00",
    });

    fireEvent.click(deleteBtns[1]);
    await waitFor(() => screen.getByText("Test Task 1"));
    await waitFor(() =>
      expect(screen.queryByText("Test Task 2")).not.toBeInTheDocument()
    );
  });
});
