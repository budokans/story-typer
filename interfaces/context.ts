import firebase from "firebase/app";

export interface ProvideAuth {
  user: firebase.User | null;
  signInWithFacebook: () => Promise<firebase.User | null | undefined>;
  signOut: () => Promise<firebase.User | null | undefined>;
}

export type AuthContext = ProvideAuth | null;
