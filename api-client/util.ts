import { InfiniteQueryObserverResult } from "react-query";
import { either as E, readonlyRecord as R } from "fp-ts";

export const defaultInfiniteQueryLimit = 10;

export type UseQuery<Err, A, T = R.ReadonlyRecord<string, unknown>> =
  | {
      readonly _tag: "loading";
    }
  | ({
      readonly _tag: "settled";
      readonly data: E.Either<Err, A>;
    } & T);

export type UseArchiveInfinite<Err, T, U> =
  | {
      _tag: "loading";
    }
  | {
      _tag: "settled";
      readonly data: E.Either<Err, readonly U[]>;
      readonly isFetching: boolean;
      readonly hasNextPage: boolean | undefined;
      readonly fetchNextPage: () => Promise<
        InfiniteQueryObserverResult<T, Err>
      >;
    };
