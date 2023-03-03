import { InfiniteData, InfiniteQueryObserverResult } from "react-query";
import { either as E } from "fp-ts";
import { Error as DBError } from "db";

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

export type UseQuery<T> =
  | {
      readonly _tag: "loading";
    }
  | {
      readonly _tag: "settled";
      readonly data: E.Either<DBError.DBError, T>;
    };
