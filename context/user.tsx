import { createContext, useContext, ReactElement } from "react";
import { useQuery } from "react-query";
import { option as O, function as F } from "fp-ts";
import { User } from "api-schemas";
import {
  CenterContent,
  LoginRerouter,
  Spinner,
  ChildrenProps,
} from "components";
import { User as DBUser } from "db";
import { useAuthContext } from "./auth";

const userContext = createContext<O.Option<User.User>>(O.none);

export const UserProvider = ({ children }: ChildrenProps): ReactElement => {
  const { authUser, authStateIsLoading, authStateIsError } = useAuthContext();
  const userId = authUser?.uid;

  const {
    data: user,
    isLoading: userQueryIsLoading,
    isError: userQueryIsError,
  } = useQuery(["user", userId], () => DBUser.getUser(userId!), {
    enabled: !!userId,
  });

  if (authStateIsError || userQueryIsError) {
    console.error({ authStateIsError, userQueryIsError });
    return <LoginRerouter />;
  }

  if (authStateIsLoading || userQueryIsLoading)
    return (
      <CenterContent>
        <Spinner />
      </CenterContent>
    );

  return (
    <userContext.Provider value={O.fromNullable(user)}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = (): User.User | null => {
  const context = useContext(userContext);

  return F.pipe(
    context,
    O.match(
      () => null,
      (context) => context
    )
  );
};
