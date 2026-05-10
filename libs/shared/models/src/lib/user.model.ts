export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}
