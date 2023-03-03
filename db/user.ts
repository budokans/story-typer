import { getDoc, getFirelord, MetaTypeCreator, setDoc } from "firelordjs";
import { db, Util as DBUtil, Error as DBError } from "db";

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

export const getUser = (id: string): Promise<DocumentRead> =>
  getDoc(users.doc(id))
    .then((docSnapshot) => {
      if (!docSnapshot.data()) throw new DBError.NotFound("User not found.");
      return docSnapshot.data()!;
    })
    .catch(DBError.catchError);

export const setUser = (createData: UserData): Promise<void> =>
  setDoc(users.doc(createData.id), createData, { merge: true }).catch(
    DBError.catchError
  );
