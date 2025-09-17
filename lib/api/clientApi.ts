import { api } from "./api";
import { User } from "@/types/user";
import { DiaryEntry, GetDiaryEntriesRep } from "@/types/note";
import type { Task } from "@/types/task";

import { BabyData, MomData } from "./serverApi";

import { GreetingData } from "@/types/greeting";

export interface GetTasksRep {
  tasks: Task[];
  totalCount: number;
  totalPages: number;
  page: number;
}
interface UpdateTaskByIdRep {
  isDone: boolean;
}

interface DeleteDiaryEntryRep {
  _id: string;
}
interface GetWeekGreetingRep {
  curWeekToPregnant: number;
  daysBeforePregnant: number;
  babyToday: {
    babySize: number;
    babyWeight: number;
    babyActivity: string;
    babyDevelopment: string;
    image: string;
  };
  momHint: string;
}

//interface GetWeekBabyInfoRep {
//  analogy: string;
//  image: string;
//  description: string[];
//  interestingFact: string;
//}
//interface GetWeekMomInfoRep {
//  feelings: { states: string[]; sensationDescr: string };
//  comfortTips: { category: string; tip: string }[];
//}
interface GetEmotionsRep {
  emotions: { _id: string; name: string }[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

// ? AUTH ENDPOINTS

export const register = async (body: {
  name: string;
  email: string;
  password: string;
}): Promise<void> => {
  const { data } = await api.post<void>("/auth/register", body);
  return data;
};

export const login = async (body: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
};

export const logout = async (): Promise<void> => {
  const { data } = await api.post<void>("/auth/logout");
  return data;
};

interface CheckSessionRequest {
  success: boolean;
}

export const checkSession = async () => {
  const { data } = await api.get<CheckSessionRequest>("/auth/session");
  return data.success;
};

// ? Profile

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/current");
  return data;
};

export const updateProfile = async (body: {
  name?: string;
  avatarUrl?: string;
  email?: string;
  dueDate?: string;
  babyGender?: string;
}) => {
  const { data } = await api.patch<User>("/users/current", body);
  return data;
};

//export const updateAvatar = async (avatar: File): Promise<User> => {
//  const formData = new FormData();
//  formData.append("avatar", avatar);
//  const res = await api.patch<User>("/users/current/avatars", formData);
//  return res.data;
//};

export const updateAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch<User>("/users/current/avatars", formData);

  return data;
};
// ? TASK ENDPOINTS

export const getTasks = async (): Promise<GetTasksRep> => {
  const { data } = await api.get<GetTasksRep>("/tasks");
  return data;
};

export const updateTaskById = async (
  taskId: string,
  body: { isDone: boolean }
): Promise<UpdateTaskByIdRep> => {
  const { data } = await api.patch<UpdateTaskByIdRep>(
    `/tasks/status/${taskId}`,
    body
  );
  return data;
};

export const createTask = async (body: {
  name: string;
  date: string;
}): Promise<Task> => {
  const { data } = await api.post<Task>("/tasks", body);
  return data;
};

// ? Diary endpoints

export const createDiaryEntry = async (body: {
  title: string;
  description: string;
  emotions: string[];
}): Promise<DiaryEntry> => {
  const { data } = await api.post<DiaryEntry>("/diary", body);
  return data;
};

export const getDiaryEntries = async (params?: {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}): Promise<GetDiaryEntriesRep> => {
  const { data } = await api.get<GetDiaryEntriesRep>("/diary", {
    params,
  });
  return data;
};

export const updateDiaryEntry = async (
  noteId: string,
  body: { title: string; description: string; emotions: string[] }
): Promise<DiaryEntry> => {
  const { data } = await api.patch<DiaryEntry>(`/diary/${noteId}`, body);
  return data;
};
export const deleteDiaryEntry = async (
  noteId: string
): Promise<DeleteDiaryEntryRep> => {
  const { data } = await api.delete<DeleteDiaryEntryRep>(`/diary/${noteId}`);
  return data;
};
export async function fetchDiaryById(noteId: string): Promise<DiaryEntry> {
  const { data } = await api.get<DiaryEntry>(`/diary/${noteId}`);
  return data;
}
// ? Weeks endpoints

export const getWeekGreeting = async (): Promise<GetWeekGreetingRep> => {
  const { data } = await api.get<GetWeekGreetingRep>("/weeks/greeting");
  return data;
};

export const getWeekGreetingPublic = async (): Promise<GetWeekGreetingRep> => {
  const { data } = await api.get<GetWeekGreetingRep>("/weeks/greeting/public");
  return data;
};

// ? Emotions endpoints

export const getEmotions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<GetEmotionsRep> => {
  const { data } = await api.get("/emotions", { params });
  return data;
};

export const getWeekInfoBaby = async ({
  weekNumber,
}: {
  weekNumber: string;
}): Promise<BabyData> => {
  const { data } = await api.get(`/weeks/${weekNumber}/baby`);
  return data;
};

export const getWeekInfoMom = async ({
  weekNumber,
}: {
  weekNumber: string;
}): Promise<MomData> => {
  const { data } = await api.get(`/weeks/${weekNumber}/mom`);
  return data;
};

/////////////////////////ruslan//////////////////////////
export const getGreeting = async (): Promise<GreetingData> => {
  const { data } = await api.get<GreetingData>("/weeks/greeting");
  return data;
};
export const getPublicGreeting = async (): Promise<GreetingData> => {
  const { data } = await api.get<GreetingData>("/weeks/greeting/public");
  return data;
};
/////////////////////////ruslan//////////////////////////
