export interface Task {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "Complete" | "In Progress";
  due: string;
}
