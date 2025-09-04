const API_URL = "http://localhost:9000";

const getToken = () => localStorage.getItem("token");
const setToken = (t: string) => localStorage.setItem("token", t);
const clearToken = () => localStorage.removeItem("token");

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      credentials: "include", // sends HttpOnly refresh cookie
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.access_token) {
      setToken(data.access_token);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; status: number; data: T }> => {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getToken();
      if (newToken) headers.Authorization = `Bearer ${newToken}`;

      res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      clearToken();
    }
  }

  let data: any = {};
  try {
    data = await res.json();
  } catch {}

  return {
    success: res.ok,
    status: res.status,
    data,
  };
};
