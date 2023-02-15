import { AuthError, getAuth } from "firebase/auth";
import { useSignOut as useReactFirebaseHook } from "react-firebase-hooks/auth";
import { firebaseApp } from "db";

export const useSignOut = (): {
  readonly signOut: () => Promise<boolean>;
  readonly isLoading: boolean;
  readonly error: AuthError | Error | undefined;
} => {
  const auth = getAuth(firebaseApp);
  const [signOut, isLoading, error] = useReactFirebaseHook(auth);

  return {
    signOut,
    isLoading,
    error,
  };
};
