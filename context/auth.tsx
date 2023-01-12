import { createContext, useContext, ReactElement } from "react";
import { option as O, function as F } from "fp-ts";
import { AuthError, getAuth, User as FirebaseUser } from "firebase/auth";
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";
import { firebaseApp } from "@/lib/firebase";
import { ChildrenProps } from "interfaces";
import { AuthUser } from "api-schemas/user";
import { buildNewUser, getUser, setUser } from "@/lib/db";

const authContext = createContext<O.Option<Auth>>(O.none);

export interface Auth {
  readonly authUser: FirebaseUser | null | undefined;
  readonly authStateIsLoading: boolean;
  readonly authStateIsError: Error | undefined;
  readonly signIn: () => Promise<void>;
  readonly signInIsLoading: boolean;
  readonly signInIsError: AuthError | undefined;
  readonly signOut: () => Promise<boolean>;
  readonly signOutIsLoading: boolean;
  readonly signOutIsError: Error | AuthError | undefined;
}

export const AuthProvider = ({ children }: ChildrenProps): ReactElement => {
  const auth = getAuth(firebaseApp);
  const [authUser, authStateIsLoading, authStateIsError] = useAuthState(auth);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithGoogle, _, signInIsLoading, signInIsError] =
    useSignInWithGoogle(auth);
  const [signOut, signOutIsLoading, signOutIsError] = useSignOut(auth);

  const signIn = async (): Promise<void> => {
    try {
      const userCred = await signInWithGoogle();
      if (userCred) {
        const authUserData: AuthUser = {
          uid: userCred.user.uid,
          name: userCred.user.displayName,
          email: userCred.user.email,
          photoURL: userCred.user.photoURL,
        };
        const storedUserData = await getUser(userCred.user.uid);

        if (storedUserData) {
          return setUser({ ...storedUserData, ...authUserData });
        } else {
          return F.pipe(userCred, ({ user }) => user, buildNewUser, setUser);
        }
      }
    } catch (e: unknown) {
      console.error(e);
    }
  };

  return (
    <authContext.Provider
      value={O.some({
        authUser,
        authStateIsLoading,
        authStateIsError,
        signIn,
        signInIsLoading,
        signInIsError,
        signOut,
        signOutIsLoading,
        signOutIsError,
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
