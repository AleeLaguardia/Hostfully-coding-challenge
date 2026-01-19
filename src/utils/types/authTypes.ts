export type User = {
  id: string;
  email: string;
  name: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
}

export type RegisterData = {
  email: string;
  password: string;
  name: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
