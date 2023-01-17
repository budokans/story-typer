import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "db";
import { User } from "api-schemas";

export const getUser = async (id: string): Promise<User.User> => {
  const docSnap = await getDoc(doc(db, "users", id));
  return docSnap.data() as User.User;
};

export const buildNewUser = (user: FirebaseUser): User.User => ({
  uid: user.uid,
  name: user.displayName,
  email: user.email,
  photoURL: user.photoURL,
  registeredDate: user.metadata.creationTime,
  lastSignInTime: user.metadata.lastSignInTime,
  personalBest: null,
  lastTenScores: [],
  gamesPlayed: 0,
  newestPlayedStoryPublishedDate: null,
  oldestPlayedStoryPublishedDate: null,
});

export const setUser = async (user: User.User): Promise<void> =>
  setDoc(doc(db, "users", user.uid), user, { merge: true });

export const updateUserDataOnWin = async (user: User.User): Promise<void> =>
  updateDoc(doc(db, "users", user.uid), { ...user });
