export interface formData {
  text: string;
  note: string;
  files: File[];
}

export interface ApiTask {
  title: string;
  description: string;
  id: string;
}

export interface Task extends ApiTask {
  submitted?: boolean;
}
