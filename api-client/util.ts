import { InfiniteData, InfiniteQueryObserverResult } from "react-query";

export interface UseInfiniteQuery<A, R> {
  readonly data: InfiniteData<A> | undefined;
  readonly error: unknown;
  readonly isFetching: boolean;
  readonly isFetchingNextPage: boolean;
  readonly fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<R, unknown>
  >;
  readonly hasNextPage: boolean | undefined;
}