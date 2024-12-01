import { requestData } from "./firebase/requestData";
import { documentExists } from "./firebase/exists";
import type { ApiTask } from "./types";

class TaskHelper {
  private date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  /**
   * Retrieve visible tasks from Firestore
   * @returns Promise<ApiTask[]>
   */
  public async getVisibleTasks(): Promise<ApiTask[]> {
    const data = await requestData("tasks");
    const tasks = (data as ApiTask[]).filter((task: ApiTask) => {
      const newTaskId = task.id + "000";
      const taskDate = new Date(Number(newTaskId));
      return taskDate.getDate() <= this.date.getDate();
    });

    return tasks;
  }
}

async function isValidTask(taskId: string): Promise<boolean> {
  return await documentExists(`tasks/${taskId}`);
}

async function taskSubmitted(taskId: string, userId: string): Promise<boolean> {
  return await documentExists(`users/${userId}/forms/${taskId}`);
}

export { isValidTask, TaskHelper, taskSubmitted };
