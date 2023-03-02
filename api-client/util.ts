import { InfiniteData, InfiniteQueryObserverResult } from "react-query";

export const defaultInfiniteQueryLimit = 10;

export interface UseInfiniteQuery<A, R> {
  readonly data: InfiniteData<A> | undefined;
  readonly error: unknown;
  readonly isFetching: boolean;
  readonly fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<R, unknown>
  >;
  readonly hasNextPage: boolean | undefined;
}
