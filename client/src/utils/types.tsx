export interface Task {
  id: number;
  title: string;
  description: string;
  status: "" | "Not Started" | "Complete" | "In Progress";
  due: string;
}
