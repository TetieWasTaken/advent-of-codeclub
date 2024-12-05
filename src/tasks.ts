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
    try {
      const data = await requestData("tasks");
      const tasks = (data as ApiTask[]).filter((task: ApiTask) => {
        const newTaskId = task.id + "000";
        const taskDate = new Date(Number(newTaskId));
        return taskDate.getDate() <= this.date.getDate();
      });

      return tasks;
    } catch (error) {
      console.warn("Error getting documents");
      console.error(error);
      return [];
    }
  }
}

async function isValidTask(taskId: string): Promise<boolean> {
  try {
    return await documentExists(`tasks/${taskId}`);
  } catch (error) {
    console.warn("Error checking if task exists");
    console.error(error);
    return false;
  }
}

async function taskSubmitted(taskId: string, userId: string): Promise<boolean> {
  try {
    return await documentExists(`users/${userId}/forms/${taskId}`);
  } catch (error) {
    console.warn("Error checking if task is submitted");
    console.error(error);
    // True to prevent resubmission
    return true;
  }
}

export { isValidTask, TaskHelper, taskSubmitted };
