import { Link as ChakraLink } from "@chakra-ui/react";

export const FiftyWordStoriesLink: React.FC<{ path?: string }> = ({
  path,
  children,
}) => {
  return (
    <ChakraLink
      color="blackAlpha.800"
      href={`https://fiftywordstories.com/${path ? path : ""}`}
      isExternal
    >
      {children}
    </ChakraLink>
  );
};
