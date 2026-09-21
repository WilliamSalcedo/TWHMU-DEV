import { createContext } from "react";

export type AuthMode = "signin" | "register";

export type AuthModalContextValue = {
  openAuth: (mode: AuthMode) => void;
};

export const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);
