import { getDoc, getFirelord } from "firelord";
import { dbAdmin } from "./firebase-admin";
import { MetadataDocumentMetaType } from "./metadata";

const metadata = getFirelord<MetadataDocumentMetaType>(dbAdmin, "metadata");

export const getStoriesCount = async (): Promise<number> =>
  getDoc(metadata.doc("data")).then((doc) =>
    doc.exists ? doc.data()!.storiesCount : 2000
  );
