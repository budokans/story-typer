import { function as F, readonlyArray as A, option as O } from "fp-ts";
import {
  addDoc,
  endBefore,
  getDoc,
  getDocs,
  getFirelord,
  limit,
  MetaTypeCreator,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  serverTimestamp,
  ServerTimestamp,
  startAfter,
} from "firelordjs";
import { db, Util as DBUtil } from "db";

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
export type DocumentWrite = DBUtil.Write<StoriesDocumentMetaType>;
export type DocumentRead = DBUtil.Read<StoriesDocumentMetaType>;

interface CreateStoryData {
  readonly title: string;
  readonly authorBio: string;
  readonly storyHtml: string;
  readonly storyText: string;
  readonly url: string;
  readonly datePublished: string;
}

export const stories = getFirelord<StoriesDocumentMetaType>(db, "stories");

export const createStory: (createData: CreateStoryData) => Promise<string> =
  F.flow(
    (createData): DocumentWrite => ({
      dateScraped: serverTimestamp(),
      ...createData,
    }),
    (body) =>
      addDoc(stories.collection(), body)
        .then((res) => res.id)
        .catch((e: unknown) => {
          throw new Error(String(e));
        })
  );

export const getStory = (id: string): Promise<DocumentRead | undefined> =>
  getDoc(stories.doc(id))
    .then(
      F.flow(
        O.fromPredicate((docSnapshot) => docSnapshot.exists()),
        O.match(
          // Force new line
          F.constUndefined,
          (docSnapshot) => ({
            id: docSnapshot.id,
            // Asserting here because exists() fails to narrow return type of data()
            ...docSnapshot.data({ serverTimestamps: "estimate" })!,
          })
        )
      )
    )
    .catch((error: unknown) => {
      throw new Error(String(error));
    });

type NewerThanParams = {
  readonly _tag: "params-newer";
  readonly _limit: number;
  readonly startAfter: O.Option<string>;
  readonly endBefore: string;
};

type OlderThanParams = {
  readonly _tag: "params-older";
  readonly _limit: number;
  readonly startAfter: O.Option<string>;
};

export type Params = NewerThanParams | OlderThanParams;

const buildQuery = (params: Params): Query<StoriesDocumentMetaType> => {
  switch (params._tag) {
    case "params-newer":
      return F.pipe(
        params.startAfter,
        O.match(
          () =>
            query(
              stories.collection(),
              orderBy("datePublished", "desc"),
              endBefore(params.endBefore),
              limit(params._limit)
            ),
          (last) =>
            query(
              stories.collection(),
              orderBy("datePublished", "desc"),
              startAfter(last),
              endBefore(params.endBefore),
              limit(params._limit)
            )
        )
      );
    case "params-older":
      return F.pipe(
        params.startAfter,
        O.match(
          () =>
            query(
              stories.collection(),
              orderBy("datePublished", "desc"),
              limit(params._limit)
            ),
          (last) =>
            query(
              stories.collection(),
              orderBy("datePublished", "desc"),
              startAfter(last),
              limit(params._limit)
            )
        )
      );
  }
};

type NewerThanCursor = {
  readonly _tag: "cursor-newer";
  readonly last: string;
  readonly endBefore: string;
};

type NewerThanCursorFinal = {
  readonly _tag: "cursor-newer-final";
};

type OlderThanCursor = {
  readonly _tag: "cursor-older";
  readonly last: string;
};

type OlderThanCursorFinal = {
  readonly _tag: "cursor-older-final";
};

type Cursor =
  | NewerThanCursor
  | NewerThanCursorFinal
  | OlderThanCursor
  | OlderThanCursorFinal;

export interface StoriesWithCursor<T> {
  readonly data: readonly T[];
  readonly cursor: Cursor;
}

const buildCursor =
  (snapshot: QuerySnapshot<StoriesDocumentMetaType>) =>
  (params: Params): Cursor =>
    F.pipe(
      snapshot,
      // If we have fewer docs than our limit, we don't need to bother with a last.
      O.fromPredicate((snapshot) => snapshot.docs.length === params._limit),
      O.chain(({ docs }) =>
        F.pipe(
          docs,
          A.fromArray,
          A.last,
          O.map((last) => last.data().datePublished)
        )
      ),
      O.match(
        (): Cursor => ({
          _tag:
            params._tag === "params-newer"
              ? "cursor-newer-final"
              : "cursor-older-final",
        }),
        (last): Cursor =>
          params._tag === "params-newer"
            ? { _tag: "cursor-newer", last, endBefore: params.endBefore }
            : { _tag: "cursor-older", last }
      )
    );

export const getStories = (
  params: Params
): Promise<StoriesWithCursor<DocumentRead>> =>
  F.pipe(
    // Force new line
    params,
    buildQuery,
    getDocs,
    (promise) =>
      promise
        .then((snapshot) => ({
          data: snapshot.docs.map(DBUtil.buildDocumentRead),
          cursor: buildCursor(snapshot)(params),
        }))
        .catch((error: unknown) => {
          throw new Error(String(error));
        })
  );

// TODO: We can safely use a TaskEither here, but the scraper will need to be refactored too.
// We should also decode here for runtime type safety as this will bypass api-client
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
                throw new Error(
                  "No date found. Are there stories in the database?"
                );
              },
              (docSnapshot) => docSnapshot.data().datePublished
            )
          )
        )
        .catch((error: unknown) => {
          throw new Error(String(error));
        })
  );

export const leastRecentStoryPublishedDate = (): Promise<string> =>
  F.pipe(
    query(stories.collection(), orderBy("datePublished", "asc"), limit(1)),
    (q) =>
      getDocs(q)
        .then(({ docs }) =>
          F.pipe(
            docs,
            A.fromArray,
            A.head,
            O.fold(
              () => {
                throw new Error(
                  "No date found. Are there stories in the database?"
                );
              },
              (docSnapshot) => docSnapshot.data().datePublished
            )
          )
        )
        .catch((error: unknown) => {
          throw new Error(String(error));
        })
  );
