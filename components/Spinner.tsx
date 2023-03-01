import { Spinner as ChakraSpinner } from "@chakra-ui/react";
import { ReactElement } from "react";

export const Spinner = ({
  size,
}: {
  readonly size?: "xl" | "xs" | "sm" | "md" | "lg";
}): ReactElement => (
  <ChakraSpinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="brand.500"
    size={size ?? "xl"}
  />
);
