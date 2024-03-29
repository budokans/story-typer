import { createContext, useContext, ReactElement } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  option as O,
  function as F,
  taskEither as TE,
  task as T,
  either as E,
} from "fp-ts";
import { User as UserAPI } from "api-client";
import { CenterContent, ChildrenProps, Spinner } from "components";

export type UserContext = UserAPI.Response;
const userContext = createContext<O.Option<UserContext>>(O.none);

export const UserLoader = ({
  authUser,
  children,
}: { readonly authUser: FirebaseUser } & ChildrenProps): ReactElement => {
  const userQuery = UserAPI.useUser(authUser.uid);
  const setUserAPI = UserAPI.useSetUser();

  const loadingSpinner = (
    <CenterContent>
      <Spinner />
    </CenterContent>
  );

  switch (userQuery._tag) {
    case "loading":
      return loadingSpinner;
    case "create-new-user": {
      if (!setUserAPI.isLoading) {
        F.pipe(
          authUser,
          UserAPI.buildNewUser,
          setUserAPI.mutateAsync,
          TE.fold(
            (error) =>
              F.pipe(
                // Force new line
                () => console.error(error),
                T.fromIO
              ),
            () => T.of(undefined)
          ),
          (unsafeRunTask) => unsafeRunTask()
        );
      }
      return loadingSpinner;
    }
    case "settled":
      return F.pipe(
        userQuery.data,
        E.match(
          (error) => <p>{error.message}</p>,
          (data) => (
            <userContext.Provider value={O.some<UserContext>(data)}>
              {children}
            </userContext.Provider>
          )
        )
      );
  }
};

export const useUserContext = (): UserContext => {
  const context = useContext(userContext);

  return F.pipe(
    context,
    O.match(
      () => {
        throw new Error(
          "useUserContext called where userContext does not exist."
        );
      },
      (context) => context
    )
  );
};
