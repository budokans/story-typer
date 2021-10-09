import { Context, createContext, useContext, FC } from "react";
import { useProvideAuth } from "@/hooks/useProvideAuth";
import { ProvideAuth } from "@/hooks/types/ProvideAuth.types";

export type AuthContext = ProvideAuth | null;

const authContext = createContext<ProvideAuth | null>(null);

export const AuthProvider: FC = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = (): ProvideAuth => {
  return useContext(authContext as Context<ProvideAuth>);
};
