export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export interface Source {
  file: string;
  page: number;
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}
