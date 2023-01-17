import { ReactElement } from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { ChildrenProps } from "components";

interface FiftyWordStoriesLinkProps {
  readonly hoverColor: string;
  readonly path?: string;
}

export const FiftyWordStoriesLink = ({
  hoverColor,
  path,
  children,
}: FiftyWordStoriesLinkProps & ChildrenProps): ReactElement => (
  <ChakraLink
    _hover={{ color: hoverColor }}
    href={`https://fiftywordstories.com/${path ? path : ""}`}
    isExternal
  >
    {children}
  </ChakraLink>
);
