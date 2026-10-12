export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}