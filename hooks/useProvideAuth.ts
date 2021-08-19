import { useCallback, useEffect, useReducer } from "react";
import { firebase } from "@/lib/firebase";
import { createUser } from "@/lib/firestore";
import { User as FirebaseUser } from "@firebase/auth-types";
import { ProvideAuth, User } from "../interfaces";

// This hook is called in @context/auth. Its value is then passed to the authProvider and thereby accessible via the useAuth() hook.

interface UseAuthState {
  status: "idle" | "pending" | "resolved" | "rejected";
  user: User | null;
}

type AuthAction = { type: "success"; user: User | null } | { type: "started" };

const AuthReducer = (state: UseAuthState, action: AuthAction): UseAuthState => {
  switch (action.type) {
    case "success": {
      return {
        ...state,
        status: "resolved",
        user: action.user,
      };
    }
    case "started": {
      return {
        ...state,
        status: "pending",
      };
    }
    default: {
      throw new Error(`Action ${action} is not recognized.`);
    }
  }
};

export const useProvideAuth = (): ProvideAuth => {
  const [state, dispatch] = useReducer(AuthReducer, {
    status: "idle",
    user: null,
  });

  const handleUser = useCallback((rawUser: FirebaseUser | null) => {
    if (rawUser) {
      const user = formatUser(rawUser);
      createUser(user.uid, user);
      dispatch({ type: "success", user });
    } else {
      dispatch({ type: "success", user: null });
    }
  }, []);

  const formatUser = (user: FirebaseUser): User => {
    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
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
    user: state.user,
    signInWithGoogle,
    signOut,
  };
};
