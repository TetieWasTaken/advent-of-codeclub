export interface formData {
  text: string;
  note: string;
  files: File[];
}

export interface Task {
  title: string;
  description: string;
}

export interface ApiTask extends Task {
  id: string;
}
