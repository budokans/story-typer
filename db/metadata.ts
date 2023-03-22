import { getFirelord, increment, MetaTypeCreator, setDoc } from "firelordjs";
import { db, Error as DBError } from "db";

export type MetadataDocumentMetaType = MetaTypeCreator<
  { readonly storiesCount: number },
  "metadata",
  string
>;

const metadata = getFirelord<MetadataDocumentMetaType>(db, "metadata");

export const incrementStoriesCount = async (
  addedStoriesCount: number
): Promise<void> =>
  setDoc(metadata.doc("data"), {
    storiesCount: increment(addedStoriesCount),
  }).catch(DBError.catchError);
