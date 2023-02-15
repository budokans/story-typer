import {
  createContext,
  useContext,
  ReactElement,
  useCallback,
  useState,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  option as O,
  function as F,
  taskEither as TE,
  task as T,
  either as E,
  io as IO,
} from "fp-ts";
import { User as UserSchema } from "api-schemas";
import { User as UserAPI } from "api-client";
import { CenterContent, Spinner, ChildrenProps } from "components";
import { useAuthContext } from "./auth";

const userContext = createContext<O.Option<UserSchema.User>>(O.none);

const buildNewUser = (user: FirebaseUser): UserSchema.User => ({
  id: user.uid,
  name: user.displayName,
  email: user.email,
  photoURL: user.photoURL,
  registeredDate: user.metadata.creationTime,
  lastSignInTime: user.metadata.lastSignInTime,
  personalBest: null,
  lastTenScores: [],
  gamesPlayed: 0,
  newestPlayedStoryPublishedDate: null,
  oldestPlayedStoryPublishedDate: null,
});

export const UserLoader = ({ children }: ChildrenProps): ReactElement => {
  const { authUser } = useAuthContext();
  const [newUserHasBeenSet, setNewUserHasBeenSet] = useState(false);
  const { data, status } = UserAPI.useUser();
  const setUserAPI = UserAPI.useSetUser();

  const setNewUser = useCallback(
    (authUser: FirebaseUser) =>
      F.pipe(
        authUser,
        buildNewUser,
        setUserAPI,
        TE.fold(
          (error) =>
            F.pipe(
              // Force new line
              () => console.error(error),
              T.fromIO
            ),
          () => T.of(undefined)
        )
      ),
    [setUserAPI]
  );

  const loadingSpinner = (
    <CenterContent>
      <Spinner />
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
            F.pipe(
              () => setNewUser(authUser),
              IO.apFirst(() => setNewUserHasBeenSet(true)),
              (unsafePerformIO) => unsafePerformIO()
            );
            setNewUser(authUser)();
            setNewUserHasBeenSet(true);
          }
          return loadingSpinner;
        } else {
          console.error(error);
          return <p>TODO: Create error page. {error}</p>;
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
