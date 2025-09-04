export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  username: string;
  email: string;
  message?: string; // For errors
}
