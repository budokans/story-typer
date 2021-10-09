import { useQuery, UseQueryResult } from "react-query";
import { useAuth } from "@/context/auth";
import { getUser } from "@/lib/db";
import { User } from "interfaces";

export const useUser = (): UseQueryResult<User> => {
  const { userId } = useAuth();
  // Query below has enabled set to true, so the query won't run until userId is truthy.

  return useQuery(["user", userId], () => getUser(userId!), {
    enabled: !!userId,
  });
};
