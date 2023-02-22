import { MetaType, QueryDocumentSnapshot } from "firelordjs";

export type Read<T extends MetaType> = T["read"] & {
  readonly id: string;
};
export type Write<T extends MetaType> = T["write"];

export const buildDocumentRead = <T extends MetaType>(
  doc: QueryDocumentSnapshot<T>
): Read<T> => ({
  id: doc.id,
  ...doc.data({ serverTimestamps: "estimate" }),
});
