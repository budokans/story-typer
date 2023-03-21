import {
  QueryObserverResult,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  function as F,
  readonlyArray as A,
  readonlyNonEmptyArray as NEA,
  option as O,
  either as E,
  task as T,
} from "fp-ts";
import { Story as DBStory, Error as DBError } from "db";
import { Story as StorySchema, User as UserSchema } from "api-schemas";
import { User as UserContext } from "context";

export type Document = DBStory.DocumentRead;
export type Response = StorySchema.StoryResponse;
export type StoriesWithCursor<T> = DBStory.StoriesWithCursor<T>;
export type InfiniteQueryParams = DBStory.InfiniteQueryParams;

export const serializeStory = (storyDoc: Document): Response => ({
  id: storyDoc.id,
  title: storyDoc.title,
  authorBio: storyDoc.authorBio,
  storyHtml: storyDoc.storyHtml,
  storyText: storyDoc.storyText,
  url: storyDoc.url,
  datePublished: storyDoc.datePublished,
  dateScraped: storyDoc.dateScraped.toDate().toISOString(),
});

type StoryQueryKey = ["story", string];

export const useStory = (
  id: string,
  options?: UseQueryOptions<
    Document | undefined,
    DBError.DBError,
    Document | undefined,
    StoryQueryKey
  >
): {
  readonly data: O.Option<Response>;
  readonly isFetching: boolean;
  readonly refetch: () => Promise<
    QueryObserverResult<Document | undefined, unknown>
  >;
} => {
  const {
    data: rawData,
    isFetching,
    refetch,
  } = useQuery<
    Document | undefined,
    DBError.DBError,
    Document | undefined,
    StoryQueryKey
  >(["story", id], () => DBStory.getStory(id), {
    refetchOnWindowFocus: false,
    ...options,
  });

  return {
    data: F.pipe(
      // Force new line
      rawData,
      O.fromNullable,
      O.map(serializeStory)
    ),
    isFetching,
    refetch,
  };
};

export const storiesQueryKey = "stories" as const;
export const leastRecentStoryPublishedDateKey =
  "least-recent-story-published-date" as const;

const getInitialParams = (
  user: UserSchema.User,
  limit: number
): InfiniteQueryParams =>
  user.newestPlayedStoryPublishedDate
    ? {
        _tag: "params-newer",
        _limit: limit,
        startAfter: O.none,
        endBefore: user.newestPlayedStoryPublishedDate,
      }
    : {
        _tag: "params-older",
        _limit: limit,
        startAfter: O.none,
      };

type UseInfiniteStories =
  | {
      readonly _tag: "loading";
    }
  | {
      readonly _tag: "settled";
      readonly stories: E.Either<
        DBError.DBError | Error,
        NEA.ReadonlyNonEmptyArray<Response>
      >;
      readonly setStories: Dispatch<SetStateAction<readonly Response[]>>;
      readonly leastRecentStoryPublishedDate: E.Either<
        DBError.DBError | Error,
        string
      >;
    };

export const useStoriesInfinite = ({
  limit,
  currentStoryIdx,
  options,
}: {
  readonly limit: number;
  readonly currentStoryIdx: number;
  readonly options?: UseInfiniteQueryOptions<
    StoriesWithCursor<Document>,
    DBError.DBError,
    StoriesWithCursor<Document>,
    StoriesWithCursor<Document>,
    typeof storiesQueryKey
  >;
}): UseInfiniteStories => {
  const user = UserContext.useUserContext();
  const [stories, setStories] = useState<readonly Response[]>([]);
  const { error, isFetching, fetchNextPage } = useInfiniteQuery<
    StoriesWithCursor<Document>,
    DBError.DBError,
    StoriesWithCursor<Document>,
    typeof storiesQueryKey
  >(
    "stories",
    ({
      pageParam = getInitialParams(user, limit),
    }: {
      readonly pageParam?: InfiniteQueryParams;
    }) => DBStory.getStories(pageParam),
    {
      getNextPageParam: ({
        cursor,
      }: StoriesWithCursor<Document>): InfiniteQueryParams =>
        F.pipe(
          cursor,
          (cursor) => {
            switch (cursor._tag) {
              case "cursor-newer":
                return {
                  _tag: "params-newer" as const,
                  startAfter: O.some(cursor.last),
                  endBefore: cursor.endBefore,
                };
              case "cursor-newer-final":
                return {
                  _tag: "params-older" as const,
                  startAfter: O.fromNullable(
                    user.oldestPlayedStoryPublishedDate
                  ),
                };
              case "cursor-older":
                return {
                  _tag: "params-older" as const,
                  startAfter: O.some(cursor.last),
                };
              case "cursor-older-final":
                return {
                  _tag: "params-older" as const,
                  startAfter: O.none,
                };
            }
          },
          (cursor) => ({
            ...cursor,
            _limit: limit,
          })
        ),
      onSuccess: ({ pages }) =>
        F.pipe(
          pages,
          A.last,
          O.chain(({ data }) => NEA.fromReadonlyArray(data)),
          O.map(NEA.map(serializeStory)),
          O.matchW(
            () => () => fetchNextPage(),
            (newStories) =>
              F.pipe(
                () =>
                  setStories((prevStories) => [...prevStories, ...newStories]),
                T.fromIO
              )
          ),
          (unsafePerformTask) => unsafePerformTask()
        ),
      refetchOnWindowFocus: false,
      ...options,
    }
  );

  const {
    data: leastRecentStoryPublishedDateData,
    isLoading: leastRecentStoryPublishedDateIsLoading,
    error: leastRecentStoryPublishedDateError,
  } = useQuery<
    string | undefined,
    DBError.DBError,
    string | undefined,
    typeof leastRecentStoryPublishedDateKey
  >(
    "least-recent-story-published-date",
    () => DBStory.leastRecentStoryPublishedDate(),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (stories.length - 1 === currentStoryIdx) fetchNextPage();
  }, [stories.length, currentStoryIdx, fetchNextPage]);

  if (
    isFetching ||
    leastRecentStoryPublishedDateIsLoading ||
    (!error && stories.length === 0)
  ) {
    return { _tag: "loading" };
  }

  return {
    _tag: "settled",
    stories: F.pipe(
      stories,
      E.fromPredicate(
        (stories): stories is NEA.ReadonlyNonEmptyArray<Response> =>
          A.isNonEmpty(stories),
        () =>
          error ?? new DBError.Unknown("Unknown error. Is the query disabled?")
      )
    ),
    setStories,
    leastRecentStoryPublishedDate: F.pipe(
      leastRecentStoryPublishedDateData,
      E.fromNullable(
        leastRecentStoryPublishedDateError ??
          new DBError.NotFound(
            "A least recent story published date was not found."
          )
      )
    ),
  };
};
