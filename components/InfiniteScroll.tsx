import { ForwardedRef, forwardRef, ReactElement } from "react";
import { Text } from "@chakra-ui/react";
import { Spinner } from "components";

interface InfiniteScrollProps {
  readonly isFetching: boolean;
  readonly hasNext: boolean | undefined;
  readonly data: readonly unknown[] | undefined;
}

export const InfiniteScroll = forwardRef(function InfiniteScroll(
  { isFetching, hasNext, data }: InfiniteScrollProps,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement {
  return (
    <div ref={ref} style={{ margin: "4rem 0 2rem" }}>
      {isFetching ? (
        <Spinner />
      ) : hasNext ? (
        <Text>Load more</Text>
      ) : data?.length === 0 ? (
        <Text>No favorites found.</Text>
      ) : (
        <Text>No more results.</Text>
      )}
    </div>
  );
});
