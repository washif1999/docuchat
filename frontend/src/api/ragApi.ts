import axios from "axios";
import type { ChatResponse } from "../types";

const BASE_URL = "http://localhost:8000";

export const uploadPDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || "Unknown upload error");
  }
};

export const clearCache = async (): Promise<string> => {
  try {
    const res = await axios.post(`${BASE_URL}/clear`);
    return res.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || "Failed to clear cache");
  }
};

export const getFiles = async (): Promise<string[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/files`);
    return res.data.files;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || "Failed to get files");
  }
};

export const selectPDF = async (filename: string): Promise<string> => {
  try {
    const res = await axios.post(`${BASE_URL}/select`, { filename });
    return res.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || "Failed to select file");
  }
};

export const askQuestion = async (question: string): Promise<ChatResponse> => {
  const res = await axios.post(`${BASE_URL}/chat`, { question });
  return res.data;
};

export const resetStore = async (): Promise<void> => {
  await axios.delete(`${BASE_URL}/reset`);
};