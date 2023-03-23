import { Spinner as ChakraSpinner } from "@chakra-ui/react";
import { ReactElement } from "react";

export const Spinner = ({
  size,
  color,
}: {
  readonly size?: "xl" | "xs" | "sm" | "md" | "lg";
  readonly color?: string;
}): ReactElement => (
  <ChakraSpinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color={color ?? "brand.500"}
    size={size ?? "xl"}
  />
);
