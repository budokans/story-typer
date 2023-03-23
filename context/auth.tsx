import { createContext, useContext, ReactElement, useCallback } from "react";
import { option as O, function as F, taskEither as TE, task as T } from "fp-ts";
import { AuthError, getAuth, User as FirebaseUser } from "firebase/auth";
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { firebaseApp } from "db";
import { ChildrenProps } from "components";

const authContext = createContext<O.Option<AuthContext>>(O.none);

export interface AuthContext {
  readonly authUser: FirebaseUser | null | undefined;
  readonly authStateIsLoading: boolean;
  readonly authStateIsError: Error | undefined;
  readonly signIn: () => void;
  readonly signInIsLoading: boolean;
  readonly signInError: AuthError | undefined;
  readonly signOut: () => void;
  readonly signOutIsLoading: boolean;
  readonly signOutError: Error | AuthError | undefined;
}

export const AuthLoader = ({ children }: ChildrenProps): ReactElement => {
  const auth = getAuth(firebaseApp);
  const [authUser, authStateIsLoading, authStateIsError] = useAuthState(auth);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithGoogle, _, signInIsLoading, signInError] =
    useSignInWithGoogle(auth);
  const [signOut, signOutIsLoading, signOutError] = useSignOut(auth);
  const router = useRouter();

  const signIn = useCallback((): void => {
    F.pipe(
      TE.tryCatch(
        () => signInWithGoogle(),
        (error) => error
      ),
      TE.chain((userCredential) =>
        TE.tryCatch(
          () =>
            userCredential
              ? router.push("/game")
              : new Promise((_, reject) => reject("No user credential found.")),
          (error) => error
        )
      ),
      TE.fold(
        (error) =>
          F.pipe(
            // Force new line
            () => console.error(error),
            T.fromIO
          ),
        () => T.of(undefined)
      )
    )();
  }, [router, signInWithGoogle]);

  return (
    <authContext.Provider
      value={O.some<AuthContext>({
        authUser,
        authStateIsLoading,
        authStateIsError,
        signIn,
        signInIsLoading,
        signInError,
        signOut,
        signOutIsLoading,
        signOutError,
      })}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = (): AuthContext => {
  const context = useContext(authContext);

  return F.pipe(
    context,
    O.match(
      () => {
        throw new Error(
          "useAuthContext called where authContext does not exist."
        );
      },
      (context) => context
    )
  );
};
