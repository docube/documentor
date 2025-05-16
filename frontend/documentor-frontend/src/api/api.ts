import { API_BASE } from "../config";
import axios from "axios";

export const fetchDocuments = async (): Promise<string[]> => {
  const res = await axios.get(`${API_BASE}/documents`);
  return res.data.documents;
};

export const uploadFiles = async (formData: FormData): Promise<string> => {
  const res = await axios.post(`${API_BASE}/upload`, formData);
  return res.data.message;
};

export const sendChatMessage = async (question: string) => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return res.body;
};
