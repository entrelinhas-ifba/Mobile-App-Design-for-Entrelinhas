import { useState } from "react";

interface GoogleAccount {
  name: string;
  email: string;
  avatarUrl: string;
}

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; avatarUrl: string }) => void;
}

export function GoogleAccountModal({
  isOpen,
  onClose,
  onSelectAccount,
}: GoogleAccountModalProps) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const mockAccounts: GoogleAccount[] = [
    {
      name: "Rebeca Alencar",
      email: "rebeca.alencar@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    },
    {
      name: "Pesquisadora IFBA",
      email: "rebeca.ifba@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    },
  ];

  const handleChoose = (account: GoogleAccount) => {
    setSelectedEmail(account.email);
    setIsLoading(true);
    setTimeout(() => {
      onSelectAccount(account);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden text-[#202124]">
        {/* Google Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex flex-col items-center text-center">
          <svg className="w-9 h-9 mb-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Fazer login com o Google
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Escolha uma conta para continuar no <strong className="text-gray-800">EntreLinhas</strong>
          </p>
        </div>

        {/* Account list */}
        <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
          {mockAccounts.map((account) => {
            const isThisLoading = isLoading && selectedEmail === account.email;
            return (
              <button
                key={account.email}
                disabled={isLoading}
                onClick={() => handleChoose(account)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={account.avatarUrl}
                    alt={account.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  {isThisLoading && (
                    <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {account.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{account.email}</p>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-blue-600">➔</span>
              </button>
            );
          })}

          {/* Use another account option */}
          <button
            onClick={() =>
              handleChoose({
                name: "Nova Conta Google",
                email: "usuario.novo@gmail.com",
                avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
              })
            }
            disabled={isLoading}
            className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 text-left transition-colors cursor-pointer text-sm font-medium text-gray-700"
          >
            <div className="w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Usar outra conta Google</p>
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="max-w-[260px] leading-snug">
            O Google compartilhará seu nome, e-mail e foto com o EntreLinhas.
          </span>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
