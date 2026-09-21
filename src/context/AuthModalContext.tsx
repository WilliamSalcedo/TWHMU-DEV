import { useState, type ReactNode } from "react";
import AuthModal from "../components/AuthModal";
import { AuthModalContext, type AuthMode } from "./auth-modal-context";

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");

  const openAuth = (m: AuthMode) => {
    setMode(m);
    setOpen(true);
  };

  return (
    <AuthModalContext.Provider value={{ openAuth }}>
      {children}
      <AuthModal open={open} mode={mode} onClose={() => setOpen(false)} onSwitchMode={setMode} />
    </AuthModalContext.Provider>
  );
}
