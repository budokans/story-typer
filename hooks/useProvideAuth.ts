import { useCallback, useEffect, useReducer } from "react";
import {
  User as AuthUser,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import { createUser, getUser } from "@/lib/db";
import { User } from "../interfaces";
import { AuthState } from "@/reducers";

export interface ProvideAuth {
  readonly userId: string | null;
  readonly isLoading: boolean;
  readonly signInWithGoogle: () => Promise<void>;
  readonly signOut: () => Promise<void>;
}

/**
 *  This hook is called in AuthProvider. Its value is then passed
 *  to down via authContext and thereby accessible with the useAuthContext() hook.
 */
export const useProvideAuth = (): ProvideAuth => {
  const [state, dispatch] = useReducer(
    AuthState.AuthReducer,
    AuthState.initialState
  );

  const handleUser = useCallback(async (authUser: AuthUser | null) => {
    if (authUser) {
      const user = await formatUser(authUser);
      await createUser(user.uid, user);
      dispatch({ type: "success", userId: user.uid });
    } else {
      dispatch({ type: "success", userId: null });
    }
  }, []);

  // If the user already exists, merge the auth data returned from
  // signInWithGoogle() with the stored non-auth user data, otherwise
  // return a new user object with those non-auth data fields initialised.
  const formatUser = async (user: AuthUser): Promise<User> => {
    const storedUserData = await getUser(user.uid);
    const userInitFields = {
      registeredDate: serverTimestamp(),
      personalBest: null,
      lastTenScores: [],
      gamesPlayed: 0,
      uniqueStoriesPlayed: 0,
      newestPlayedStoryPublishedDate: null,
      oldestPlayedStoryPublishedDate: null,
    };
    const userAuthData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    return storedUserData
      ? { ...storedUserData, ...userAuthData }
      : { ...userInitFields, ...userAuthData };
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(firebaseApp);
      const { user } = await signInWithPopup(auth, provider);
      handleUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      const auth = getAuth();
      firebaseSignOut(auth).then(() => handleUser(null));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "started" });
      handleUser(user);
    });
    return () => unsubscribe();
  }, [handleUser]);

  return {
    isLoading: state.status === "idle" || state.status === "pending",
    userId: state.userId,
    signInWithGoogle,
    signOut,
  };
};
