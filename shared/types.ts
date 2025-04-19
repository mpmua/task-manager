export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "" | "Not Started" | "Complete" | "In Progress";
  due: string;
}
