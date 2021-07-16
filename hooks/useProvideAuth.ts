import { useCallback, useEffect, useState } from "react";
import { firebase } from "../lib/firebase";
import { ProvideAuth } from "../interfaces";
import { User } from "../interfaces";

export const useProvideAuth = (): ProvideAuth => {
  const [user, setUser] = useState<User | null>(null);

  const handleUser = useCallback((rawUser: firebase.User | null) => {
    if (rawUser) {
      const user = formatUser(rawUser);
      setUser(user);
      return user;
    } else {
      setUser(null);
      return null;
    }
  }, []);

  const formatUser = (user: firebase.User): User => {
    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
  };

  const signInWithFacebook = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      return await firebase
        .auth()
        .signInWithPopup(provider)
        .then((response) => handleUser(response.user));
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      return await firebase
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
    signInWithFacebook,
    signOut,
  };
};
