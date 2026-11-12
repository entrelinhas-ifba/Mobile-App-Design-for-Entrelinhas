import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

interface LoginScreenProps {
  onSuccess?: () => void;
  onSkip?: () => void;
}

export function LoginScreen({ onSuccess, onSkip }: LoginScreenProps) {
  const { loginWithEmail, registerWithEmail, continueAsGuest, isLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (mode === "login") {
        await loginWithEmail({ email, password, rememberMe });
      } else {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem.");
        }
        await registerWithEmail({ name, email, password, confirmPassword });
      }
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocorreu um erro ao processar. Tente novamente.");
      }
    }
  };

  const handleQuickDemo = () => {
    if (mode === "register") {
      setName("Rebeca Freitas");
      setEmail("rebecafa02@gmail.com");
      setPassword("senha1234");
      setConfirmPassword("senha1234");
      setErrorMessage("");
    } else {
      setEmail("rebecafa02@gmail.com");
      setPassword("senha1234");
      setErrorMessage("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FBFBFA] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      {/* Background ambient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[440px] z-10">
        {/* Brand Card with Uploaded Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2 bg-white rounded-3xl shadow-lg shadow-blue-500/5 border border-blue-100 ring-8 ring-blue-50/70 mb-3 group transition-transform duration-300 hover:scale-105">
            <img
              src="/logo.jpg"
              alt="Logo EntreLinhas"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl"
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2421] tracking-tight">
            EntreLinhas
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-1">
            Mais que palavras, significados.
          </p>
        </div>

        {/* Main Authentication Box */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl shadow-gray-200/50 p-6 sm:p-8">
          {/* Mode Switch (Entrar / Cadastrar) */}
          <div className="flex p-1 bg-[#F3F2EE] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#1F2421] shadow-xs"
                  : "text-[#6B7280] hover:text-[#1F2421]"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-white text-[#1F2421] shadow-xs"
                  : "text-[#6B7280] hover:text-[#1F2421]"
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome ou apelido"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Endereço de E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#374151]">
                  Senha
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs text-[#1D4ED8] hover:text-[#1E40AF] font-medium hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1D4ED8] focus:ring-[#1D4ED8] cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-[#4B5563] cursor-pointer select-none"
                >
                  Manter-me conectado neste dispositivo
                </label>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] hover:from-[#1E40AF] hover:to-[#1D4ED8] text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === "login" ? (
                "Entrar no EntreLinhas"
              ) : (
                "Concluir Cadastro"
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Precisa testar rapidamente?</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-[#1D4ED8] hover:text-[#1E40AF] font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>⚡ Preencher Demo</span>
            </button>
          </div>
        </div>

        {/* Guest access option */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => {
              continueAsGuest();
              if (onSkip) onSkip();
              else if (onSuccess) onSuccess();
            }}
            className="text-xs sm:text-sm text-[#4B5563] hover:text-[#1F2421] font-medium transition-colors hover:underline cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Explorar acervo sem fazer login</span>
            <span>➔</span>
          </button>
        </div>

        {/* Security badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-[#9CA3AF]">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Conexão Segura SSL
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacidade Garantida
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
}
