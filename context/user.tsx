import { Context, createContext, useContext } from "react";
import { useQuery } from "react-query";
import { useAuth } from "./auth";
import { User } from "interfaces";
import { getUser } from "@/lib/db";

const userContext = createContext<User | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const { userId } = useAuth();
  // Query below has enabled set to true, so the query won't run until userId is truthy.

  const { data } = useQuery(["user", userId], () => getUser(userId), {
    enabled: !!userId,
  });

  return (
    <userContext.Provider value={data || null}>{children}</userContext.Provider>
  );
};

export const useUser = (): User => {
  return useContext(userContext as Context<User>);
};
