import { useCallback, useEffect, useReducer } from "react";
import { firebase } from "@/lib/firebase";
import { createUser, queryUser } from "@/lib/db";
import { User as FirebaseUser } from "@firebase/auth-types";
import { User } from "../interfaces";
import { AuthReducer, initialAuthState } from "./reducers/AuthReducer";
import { ProvideAuth } from "./types/ProvideAuth.types";

// This hook is called in @context/auth. Its value is then passed to the authProvider and thereby accessible via the useAuth() hook.

export const useProvideAuth = (): ProvideAuth => {
  const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

  const handleUser = useCallback(async (rawUser: FirebaseUser | null) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      await createUser(user.uid, user);
      dispatch({ type: "success", userId: user.uid });
    } else {
      dispatch({ type: "success", userId: null });
    }
  }, []);

  // If the user already exists, merge the auth data returned from signInWithGoogle() with the stored non-auth user data, otherwise return a new user object with those non-auth data fields initialised.
  const formatUser = async (user: FirebaseUser): Promise<User> => {
    const storedUserData = await queryUser(user.uid);
    const userInitFields = {
      registeredDate: firebase.firestore.FieldValue.serverTimestamp(),
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
      const provider = new firebase.auth.GoogleAuthProvider();
      const { user } = await firebase.auth().signInWithPopup(provider);
      handleUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      handleUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
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
