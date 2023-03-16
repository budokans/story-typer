import {
  QueryObserverResult,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";
import {
  function as F,
  array as AMut,
  readonlyArray as A,
  option as O,
} from "fp-ts";
import { Story as DBStory, Error as DBError } from "db";
import { Story as StorySchema, User as UserSchema } from "api-schemas";
import { Util as APIUtil } from "api-client";
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
    unknown,
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
    unknown,
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

const serializePagesData: (
  pages: StoriesWithCursor<Document>[]
) => StoriesWithCursor<Response>[] = AMut.map((page) => ({
  data: F.pipe(page.data, A.map(serializeStory)),
  cursor: page.cursor,
}));

type StoriesQueryKey = "stories";

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

export const useStoriesInfinite = ({
  limit,
  options,
}: {
  readonly limit: number;
  readonly options?: UseInfiniteQueryOptions<
    StoriesWithCursor<Document>,
    DBError.DBError,
    StoriesWithCursor<Document>,
    StoriesWithCursor<Document>,
    StoriesQueryKey
  >;
}): APIUtil.UseInfiniteQuery<
  StoriesWithCursor<Response>,
  StoriesWithCursor<Document>
> => {
  const user = UserContext.useUserContext();
  const {
    data: rawData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<
    StoriesWithCursor<Document>,
    DBError.DBError,
    StoriesWithCursor<Document>,
    StoriesQueryKey
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
      refetchOnWindowFocus: false,
      ...options,
    }
  );

  return {
    data: F.pipe(
      rawData,
      O.fromNullable,
      O.map((raw) => ({
        pages: serializePagesData(raw.pages),
        pageParams: raw.pageParams,
      })),
      O.getOrElseW(F.constUndefined)
    ),
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  };
};

type LeastRecentStoryPublishedDateKey = "least-recent-story-published-date";

export const useLeastRecentStoryPublishedDate = (
  options?: UseQueryOptions<
    string,
    unknown,
    string,
    LeastRecentStoryPublishedDateKey
  >
): {
  readonly data: string | undefined;
  readonly isLoading: boolean;
  readonly error: unknown;
} => {
  const { data, isLoading, error } = useQuery<
    string,
    unknown,
    string,
    LeastRecentStoryPublishedDateKey
  >(
    "least-recent-story-published-date",
    () => DBStory.leastRecentStoryPublishedDate(),
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};
