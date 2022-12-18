import { taskEither as TE, function as F } from "fp-ts";
import { db } from "./";

export const createUser = async (user: User): Promise<void> => {
  db.collection("users").doc(user.uid).set(user, { merge: true });
};
