import App from "../src/App";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Task } from "../../shared/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockGetTasks = jest.fn();
const mockCreateTask = jest.fn();
const mockEditTask = jest.fn();
const mockDeleteTask = jest.fn();

const dummyTask: Task = {
  id: 3,
  title: "Test Task 3",
  description: "Dummy Task Description",
  status: "Not Started",
  due: "2025-04-23T10:00",
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
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        tasksList: [
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
        ],
      },
    });

    render(<App />);
    await waitFor(() => screen.getByText("Test Task 1"));
    await waitFor(() => screen.getByText("Test Task 2"));

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  it("handles task creation", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: dummyTask });

    render(<App />);

    fireEvent.click(screen.getByText(/Create Task/i));
    fireEvent.change(
      screen.getByRole("textbox", { name: "TITLE (Required)" }),
      {
        target: { value: "Test Task 3" },
      }
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Description (Optional)" }),
      {
        target: { value: "Test Task 3 Description" },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Status (Required)" }),
      {
        target: { value: "In Progress" },
      }
    );

    fireEvent.change(screen.getByLabelText(/due/i), {
      target: { value: "2025-04-25T10:00" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => screen.getByText("Test Task 3"));

    expect(screen.getByText("Test Task 3")).toBeInTheDocument();
  });

  it("handles editing a task", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        tasksList: [
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
        ],
      },
    });

    render(<App />);

    await waitFor(() => screen.getByText("Test Task 1"));
    const editButtons = screen.getAllByRole("button", { name: /Edit Task/i });
    fireEvent.click(editButtons[0]);

    fireEvent.change(
      screen.getByRole("textbox", { name: "TITLE (Required)" }),
      {
        target: { value: "Test Task 1 - Edited" },
      }
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Description (Optional)" }),
      {
        target: { value: "Test Task 1 Description - Edited" },
      }
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Status (Required)" }),
      {
        target: { value: "Completed" },
      }
    );

    fireEvent.change(screen.getByLabelText(/due/i), {
      target: { value: "2025-04-24T10:00" },
    });

    // mockedAxios.patch.mockResolvedValueOnce({
    //   id: 1,
    //   title: "Test Task 1 - Edited",
    //   description: "Test Task 1 Description - Edited",
    //   status: "Complete",
    //   due: "2025-04-24T10:00",
    // });

    mockedAxios.patch.mockResolvedValueOnce({
      data: {
        id: 1,
        title: "Test Task 1 - Edited",
        description: "Test Task 1 Description - Edited",
        status: "Complete",
        due: "2025-04-24T10:00",
      },
    });

    fireEvent.click(screen.getByText(/Submit/i));
    // await waitFor(() => {
    //   expect(screen.queryByLabelText(/TITLE/i)).not.toBeInTheDocument();
    // });

    await waitFor(() => {
      screen.debug();
    });

    await waitFor(() => screen.getByText("Test Task 1 - Edited"));
    expect(screen.getByText("Test Task 1 - Edited")).toBeInTheDocument();
  });

  it("handles a task being deleted", async () => {
    window.confirm = jest.fn().mockReturnValue(true);

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        tasksList: [
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
        ],
      },
    });

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
