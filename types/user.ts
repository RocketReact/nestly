export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  dueDate: string;
  babyGender: string;
  theme?: string;
  curWeekNumber?: number;
}

export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
