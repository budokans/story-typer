import { createContext, useContext, ReactElement, useState } from "react";
import {
  option as O,
  function as F,
  taskEither as TE,
  task as T,
  either as E,
} from "fp-ts";
import { User as UserSchema } from "api-schemas";
import { User as UserAPI } from "api-client";
import { CenterContent, ChildrenProps, Game } from "components";
import { useAuthContext } from "./auth";
import { useMediaQuery } from "@chakra-ui/react";

const userContext = createContext<O.Option<UserSchema.User>>(O.none);

export const UserLoader = ({ children }: ChildrenProps): ReactElement => {
  const { authUser } = useAuthContext();
  const [newUserHasBeenSet, setNewUserHasBeenSet] = useState(false);
  const { data, status } = UserAPI.useUser();
  const setUserAPI = UserAPI.useSetUser();
  const [mediaQuery] = useMediaQuery("(min-width: 769px)");
  const viewportIsWiderThan768 = mediaQuery!;

  const loadingSpinner = (
    <CenterContent>
      <Game.Game>
        <Game.Skeleton isLargeViewport={viewportIsWiderThan768} />
      </Game.Game>
    </CenterContent>
  );

  // TODO: We really need a DatumEither here. This handling of asynchronous refreshable data
  // with Eithers is both awkward and dangerous.
  if (status === "loading") {
    return loadingSpinner;
  }

  return F.pipe(
    data,
    E.match(
      (error) => {
        if (error === UserAPI.noUserResponseMessage) {
          if (authUser && !newUserHasBeenSet) {
            setNewUserHasBeenSet(true);
            F.pipe(
              authUser,
              UserAPI.buildNewUser,
              setUserAPI,
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
        } else {
          console.error(error);
          return <p>TODO: Create error page.</p>;
        }
      },
      (data) => (
        <userContext.Provider value={O.some(data)}>
          {children}
        </userContext.Provider>
      )
    )
  );
};

export const useUserContext = (): UserSchema.User => {
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
