import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + "/api";

export const nextServer = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
