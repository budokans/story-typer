import { useCallback, useEffect, useState } from "react";
import { firebase } from "@/lib/firebase";
import { createUser } from "@/lib/firestore";
import { User as FirebaseUser } from "@firebase/auth-types";
import { ProvideAuth, User } from "../interfaces";

export const useProvideAuth = (): ProvideAuth => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUser = useCallback((rawUser: FirebaseUser | null) => {
    if (rawUser) {
      const user = formatUser(rawUser);
      createUser(user.uid, user);
      setUser(user);
      setLoading(false);
      return user;
    } else {
      setUser(null);
      setLoading(false);
      return null;
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
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then((response) => handleUser(response.user));
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase
        .auth()
        .signOut()
        .then(() => handleUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      handleUser(user);
    });
    return () => unsubscribe();
  }, [handleUser]);

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
};
