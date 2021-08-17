import { Link as ChakraLink } from "@chakra-ui/react";

export const FiftyWordStoriesLink: React.FC<{
  hoverColor: string;
  path?: string;
}> = ({ hoverColor, path, children }) => {
  return (
    <ChakraLink
      _hover={{ color: hoverColor }}
      href={`https://fiftywordstories.com/${path ? path : ""}`}
      isExternal
    >
      {children}
    </ChakraLink>
  );
};
