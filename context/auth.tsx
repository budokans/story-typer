import { createContext, useContext } from "react";
import { useProvideAuth } from "../hooks/useProvideAuth";
import { ProvideAuth } from "../interfaces/context";

const authContext = createContext<ProvideAuth | null>(null);

export const useAuth = (): ProvideAuth | null => {
  return useContext(authContext);
};

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
