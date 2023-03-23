import { function as F, readonlyArray as A, option as O } from "fp-ts";
import {
  addDoc,
  getDoc,
  getDocs,
  getFirelord,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  ServerTimestamp,
  updateDoc,
} from "firelord";
import { MetaTypeCreator, WriteResult } from "firelord/dist/types";
import { dbAdmin } from "./firebase-admin";
import { Story as DBStory, Error as DBError, Util as DBUtil } from "db";

export type MetadataDocumentMetaType = MetaTypeCreator<
  { readonly storiesCount: number },
  "metadata",
  "data"
>;

const metadata = getFirelord<MetadataDocumentMetaType>(dbAdmin, "metadata");

export const getStoriesCount = async (): Promise<number> =>
  getDoc(metadata.doc("data"))
    .then((doc) => (doc.exists ? doc.data()!.storiesCount : 5304))
    .catch(DBError.catchError);

export const incrementStoriesCount = async (
  addedStoriesCount: number
): Promise<WriteResult | undefined> =>
  updateDoc(metadata.doc("data"), {
    storiesCount: increment(addedStoriesCount),
  }).catch(DBError.catchError);

export type StoriesDocumentMetaType = MetaTypeCreator<
  {
    readonly title: string;
    readonly authorBio: string;
    readonly storyHtml: string;
    readonly storyText: string;
    readonly url: string;
    readonly datePublished: string;
    readonly dateScraped: ServerTimestamp;
  },
  "stories",
  string
>;

type DocumentWrite = DBUtil.Write<StoriesDocumentMetaType>;

const stories = getFirelord<StoriesDocumentMetaType>(dbAdmin, "stories");

// TODO: We can safely use a TaskEither here, but the scraper will need to be refactored too.
// We should also decode here for runtime type safety as this will bypass api-client
export const createStory: (
  createData: DBStory.CreateStoryData
) => Promise<string> = F.flow(
  (createData): DocumentWrite => ({
    dateScraped: serverTimestamp(),
    ...createData,
  }),
  (body) =>
    addDoc(stories.collection(), body)
      .then((res) => res.id)
      .catch(DBError.catchError)
);

export const mostRecentStoryPublishedDate = (): Promise<string> =>
  F.pipe(
    query(stories.collection(), orderBy("datePublished", "desc"), limit(1)),
    (q) =>
      getDocs(q)
        .then(({ docs }) =>
          F.pipe(
            docs,
            A.fromArray,
            A.head,
            O.fold(
              () => {
                throw new DBError.NotFound(
                  "No date found. Are there stories in the database?"
                );
              },
              (docSnapshot) => docSnapshot.data().datePublished
            )
          )
        )
        .catch(DBError.catchError)
  );
