import { apiRequest } from "./API";
import type { LoginResponse } from "../Interfaces/AuthInterfaces";

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    credentials: "include", // needed for refresh cookies
  });

  if (response.success && response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  
  return response.data;
};


export const logoutUser = async () => {
  await apiRequest("/logout", { method: "POST" });
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};
