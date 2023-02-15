import { createContext, useContext, ReactElement } from "react";
import { option as O, function as F, taskEither as TE, task as T } from "fp-ts";
import { AuthError, getAuth, User as FirebaseUser } from "firebase/auth";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { firebaseApp } from "db";
import { ChildrenProps } from "components";

const authContext = createContext<O.Option<Auth>>(O.none);

export interface Auth {
  readonly authUser: FirebaseUser | null | undefined;
  readonly authStateIsLoading: boolean;
  readonly authStateIsError: Error | undefined;
  readonly signIn: () => void;
  readonly signInIsLoading: boolean;
  readonly signInError: AuthError | undefined;
}

export const AuthProvider = ({ children }: ChildrenProps): ReactElement => {
  const auth = getAuth(firebaseApp);
  const [authUser, authStateIsLoading, authStateIsError] = useAuthState(auth);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithGoogle, _, signInIsLoading, signInError] =
    useSignInWithGoogle(auth);
  const router = useRouter();

  const signIn = (): void => {
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
  };

  return (
    <authContext.Provider
      value={O.some({
        authUser,
        authStateIsLoading,
        authStateIsError,
        signIn,
        signInIsLoading,
        signInError,
      })}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = (): Auth => {
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
