import { requestData } from "./firebase/requestData";
import type { ApiTask, Task } from "./types";

class TaskHelper {
  private date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  /**
   * Retrieve visible tasks from Firestore
   * @returns Promise<Task[]>
   */
  public async getVisibleTasks(): Promise<Task[]> {
    const data = await requestData("tasks");
    const tasks = (data as ApiTask[]).filter((task: ApiTask) => {
      const newTaskId = task.id + "000";
      const taskDate = new Date(Number(newTaskId));
      return taskDate.getDate() <= this.date.getDate();
    }) as Task[];

    return tasks;
  }
}

export { TaskHelper };
