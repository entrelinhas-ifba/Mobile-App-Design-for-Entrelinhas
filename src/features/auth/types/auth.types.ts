export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: "email" | "google" | "guest";
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (credentials: LoginCredentials) => Promise<void>;
  registerWithEmail: (credentials: RegisterCredentials) => Promise<void>;
  loginWithGoogle: (customUser?: { name: string; email: string; avatarUrl?: string }) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}
