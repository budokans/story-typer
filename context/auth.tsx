import { Context, createContext, useContext } from "react";
import { useProvideAuth } from "@/hooks/useProvideAuth";
import { ProvideAuth } from "../interfaces";

const authContext = createContext<ProvideAuth | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = (): ProvideAuth => {
  return useContext(authContext as Context<ProvideAuth>);
};
