import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, LoginCredentials, RegisterCredentials, AuthContextType } from "../types/auth.types";
import { authService } from "../services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "@entrelinhas:user";
const TOKEN_STORAGE_KEY = "@entrelinhas:token";
const NAMES_CACHE_KEY = "@entrelinhas:registered_names";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage or sessionStorage on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Erro ao carregar sessão anterior:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async ({ email, password, rememberMe = true }: LoginCredentials) => {
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Por favor, preencha o e-mail e a senha.");
      }

      const cleanEmail = email.trim().toLowerCase();

      // Chamada real ao backend EntreLinhas: localhost:8002/auth/login
      const data = await authService.login({
        email: cleanEmail,
        senha: password,
      });

      // Recupera nome cadastrado previamente ou formata a partir do e-mail
      let displayName = cleanEmail.split("@")[0];
      try {
        const savedUsersRaw = localStorage.getItem(NAMES_CACHE_KEY);
        if (savedUsersRaw) {
          const namesMap = JSON.parse(savedUsersRaw);
          if (namesMap[cleanEmail]) displayName = namesMap[cleanEmail];
        }
      } catch {
        // Fallback silencioso
      }
      displayName = displayName
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      const authenticatedUser: User = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: displayName || "Leitor EntreLinhas",
        email: cleanEmail,
        provider: "email",
        createdAt: new Date().toISOString(),
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
      storage.setItem(TOKEN_STORAGE_KEY, data.token);

      setUser(authenticatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async ({ name, email, password }: RegisterCredentials) => {
    setIsLoading(true);

    try {
      if (!name || name.trim().length < 2) {
        throw new Error("Por favor, informe seu nome completo.");
      }

      if (!email || !email.includes("@")) {
        throw new Error("Informe um e-mail válido.");
      }

      if (!password || password.length < 6) {
        throw new Error("A senha precisa ter pelo menos 6 caracteres.");
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      // Chamada real ao backend EntreLinhas: localhost:8002/auth/register
      // {"nome": cleanName, "email": cleanEmail, "senha": password}
      await authService.register({
        nome: cleanName,
        email: cleanEmail,
        senha: password,
      });

      // Armazena cache do nome registrado
      try {
        const savedUsersRaw = localStorage.getItem(NAMES_CACHE_KEY) || "{}";
        const namesMap = JSON.parse(savedUsersRaw);
        namesMap[cleanEmail] = cleanName;
        localStorage.setItem(NAMES_CACHE_KEY, JSON.stringify(namesMap));
      } catch {
        // Fallback silencioso
      }

      // Efetua login automático após o registro para emitir o JWT
      const loginData = await authService.login({
        email: cleanEmail,
        senha: password,
      });

      const newUser: User = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: cleanName,
        email: cleanEmail,
        provider: "email",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, loginData.token);

      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (customUser?: { name: string; email: string; avatarUrl?: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const googleUser: User = {
      id: "usr_google_" + Math.random().toString(36).substring(2, 9),
      name: customUser?.name || "Usuário Google",
      email: customUser?.email || "usuario.google@gmail.com",
      avatarUrl:
        customUser?.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    const token = "google_oauth_token_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(googleUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    setUser(googleUser);
    setIsLoading(false);
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: "usr_guest_" + Math.random().toString(36).substring(2, 7),
      name: "Visitante",
      email: "convidado@entrelinhas.app",
      provider: "guest",
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
