import { getDoc, getFirelord, MetaTypeCreator, setDoc } from "firelordjs";
import { db, Util as DBUtil } from "db";

type UserData = {
  readonly id: string;
  readonly name: string | null;
  readonly email: string | null;
  readonly photoURL: string | null;
  readonly registeredDate: string;
  readonly lastSignInTime: string;
  readonly personalBest: number | null;
  readonly lastTenScores: readonly number[];
  readonly gamesPlayed: number;
  readonly newestPlayedStoryPublishedDate: string | null;
  readonly oldestPlayedStoryPublishedDate: string | null;
};

export type UserDocumentMetaType = MetaTypeCreator<UserData, "users", string>;
export type DocumentWrite = DBUtil.Write<UserDocumentMetaType>;
export type DocumentRead = DBUtil.Read<UserDocumentMetaType>;

export const users = getFirelord<UserDocumentMetaType>(db, "users");

export const getUser = (id: string): Promise<DocumentRead | undefined> =>
  getDoc(users.doc(id))
    .then((docSnapshot) => docSnapshot.data())
    .catch((error: unknown) => {
      throw new Error(String(error));
    });

export const setUser = (createData: UserData): Promise<void> =>
  setDoc(users.doc(createData.id), createData, { merge: true }).catch(
    (error: unknown) => {
      throw new Error(String(error));
    }
  );
