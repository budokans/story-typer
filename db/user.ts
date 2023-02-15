import {
  doc,
  FirestoreDataConverter,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
} from "firebase/firestore";
import { function as F } from "fp-ts";
import { db } from "./";
import { User as UserSchema } from "api-schemas";

export interface UserDocument {
  readonly id: string;
  readonly name: string | null;
  readonly email: string | null;
  readonly photoURL: string | null;
  readonly registeredDate: string | undefined;
  readonly lastSignInTime: string | undefined;
  readonly personalBest: number | null;
  readonly lastTenScores: readonly number[];
  readonly gamesPlayed: number;
  readonly newestPlayedStoryPublishedDate: string | null;
  readonly oldestPlayedStoryPublishedDate: string | null;
}

export const userConverter: FirestoreDataConverter<UserDocument> = {
  toFirestore: (body: UserDocument) => body,
  fromFirestore: (snapshot: QueryDocumentSnapshot): UserDocument =>
    F.pipe(
      snapshot,
      (snapshot) => ({ id: snapshot.id, data: snapshot.data() }),
      ({ id, data }): UserDocument => ({
        id: id,
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
        registeredDate: data.registeredDate,
        lastSignInTime: data.lastSignInTime,
        personalBest: data.personalBest,
        lastTenScores: data.lastTenScores,
        gamesPlayed: data.gamesPlayed,
        newestPlayedStoryPublishedDate: data.newestPlayedStoryPublishedDate,
        oldestPlayedStoryPublishedDate: data.oldestPlayedStoryPublishedDate,
      })
    ),
};

export const getUser = async (id: string): Promise<UserDocument | undefined> =>
  F.pipe(
    // Force new line
    doc(db, "users", id).withConverter(userConverter),
    (docRef) => getDoc(docRef).then((docSnapshot) => docSnapshot.data())
  );

export const setUser = async (user: UserSchema.User): Promise<void> =>
  F.pipe(
    // Force new line
    doc(db, "users", user.id).withConverter(userConverter),
    (docRef) => setDoc(docRef, user, { merge: true })
  );
