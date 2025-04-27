# Full-Stack Task Manager Application

This is a full-stack task management application built with **React**, **Express.js** and **SQLite**.

## Features

- Create, update, delete, and view tasks
- Fully unit tested (server and client)
- TypeScript used on both frontend and backend
- API routes documented

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Express.js, TypeScript
- **Database:** SQLite
- **Testing:** Jest
- **Build Tools:** tsc, ts-node-dev

---

## Project Structure

```
/client   -> React frontend
/server   -> Express backend
/dist     -> Built backend output
```

## Getting Started

### Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### Run the app (development mode)

```bash
# Run below from root directory:
npm run dev    # This will run both the frontend and backend
```

## Running Tests

- Unit tests are included for both client and server.

```bash
npm run test
```

---

### Build the app

```bash
npm run build
```

This will:

- Run unit tests
- Build both the frontend and backend projects

---

## API Documentation

### Base URL

```
http://localhost:4000
```

# Task Manager API

This API allows users to create, fetch, edit, and delete tasks.

## Endpoints Overview

|            Method            | Endpoint     | Description             |
| :--------------------------: | :----------- | :---------------------- |
|  [GET](#1-fetch-all-tasks)   | `/`          | Fetch all tasks         |
| [POST](#2-create-a-new-task) | `/tasks`     | Create a new task       |
|   [PATCH](#3-edit-a-task)    | `/tasks/:id` | Edit an existing task   |
|  [DELETE](#4-delete-a-task)  | `/tasks/:id` | Delete an existing task |

---

## Endpoints Details

### 1. Fetch All Tasks

**GET /**

- **Description**: Retrieve a list of all tasks.

#### Response

- **Success (200 OK)**

```json
{
  "tasksList": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Optional description",
      "status": "Not Started | In Progress | Complete",
      "due": "2025-05-01T12:00:00.000Z"
    }
  ]
}
```

(Multiple task objects may be returned)

- **Error (500 Internal Server Error)**

```json
{
  "error": "Error fetching data from DB: <error details>"
}
```

---

### 2. Create a New Task

**POST /tasks**

- **Description**: Create a new task.

#### Request Body

```json
{
  "title": "Task Title",
  "description": "Optional description",
  "status": "Not Started | In Progress | Complete",
  "due": "2025-05-01T12:00"
}
```

#### Response

- **Success (201 Created)**

```json
{
  "id": 2,
  "title": "Task Title",
  "description": "Optional description",
  "status": "Not Started | In Progress | Complete",
  "due": "2025-05-01T12:00"
}
```

- **Error (500 Internal Server Error)**

```json
{
  "error": "Error creating task: <error details>"
}
```

---

### 3. Edit a Task

**PATCH /tasks/:id**

- **Description**: Update an existing task's details.
- **Route Parameter**:
  - `id` (number) — ID of the task to edit.

#### Request Body

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "Not Started | In Progress | Complete",
  "due": "2025-06-01T15:30"
}
```

#### Response

- **Success (201 Created)**

```json
{
  "id": 2,
  "title": "Updated Title",
  "description": "Updated description",
  "status": "In Progress",
  "due": "2025-06-01T15:30"
}
```

- **Error (500 Internal Server Error)**

```json
{
  "error": "Error editing task with id of <id>: <error details>"
}
```

---

### 4. Delete a Task

**DELETE /tasks/:id**

- **Description**: Delete an existing task.
- **Route Parameter**:
  - `id` (number) — ID of the task to delete.
- **Request Body**: No request body needed for this endpoint.

#### Response

- **Success (200 OK)**

```json
{
  "success": true,
  "message": "Task with ID of <id> deleted successfully"
}
```

- **Error (500 Internal Server Error)**

```json
{
  "error": "Error deleting task with id of <id>: <error details>"
}
```

---

# End
