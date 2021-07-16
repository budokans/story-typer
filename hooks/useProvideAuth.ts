import { useEffect, useState } from "react";
import { firebase } from "../lib/firebase";
import { ProvideAuth } from "../interfaces/context";

export const useProvideAuth = (): ProvideAuth => {
  const [user, setUser] = useState<firebase.User | null>(null);

  const signInWithFacebook = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      return await firebase
        .auth()
        .signInWithPopup(provider)
        .then((response) => {
          setUser(response.user);
          return response.user;
        });
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      return await firebase
        .auth()
        .signOut()
        .then(() => setUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    signInWithFacebook,
    signOut,
  };
};
