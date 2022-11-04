import { ReactElement } from "react";
import {
  Box,
  Flex,
  Link as ChakraLink,
  Text as ChakraText,
  Icon,
  VisuallyHidden,
} from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";
import { ChildrenProps } from "interfaces";
import { Styles } from "@/styles";

export const Footer = ({ children }: ChildrenProps): ReactElement => {
  return (
    <Container>
      <Inner>{children}</Inner>
    </Container>
  );
};

const Container = ({ children }: ChildrenProps): ReactElement => {
  return (
    <Box
      as="footer"
      bg="white"
      w="full"
      position="absolute"
      bottom={0}
      h={[
        Styles.headerHeightMobile,
        Styles.headerHeightMobile,
        Styles.headerHeightDesktop,
      ]}
    >
      {children}
    </Box>
  );
};

const Inner = ({ children }: ChildrenProps): ReactElement => {
  return (
    <Flex
      h="100%"
      maxW="930px"
      margin="0 auto"
      align="center"
      justify={["center", "center", "flex-end"]}
      pr={[0, 0, 4, 0]}
    >
      {children}
    </Flex>
  );
};

export const Text = ({ children }: ChildrenProps): ReactElement => (
  <ChakraText color="blackAlpha.800" fontSize="clamp(0.75rem, 2vw, 1rem)">
    {children}
  </ChakraText>
);

export const NameLink = ({ children }: ChildrenProps): ReactElement => (
  <ChakraLink
    href="https://stevenwebster.co/"
    isExternal
    color="blackAlpha.800"
    ml={1}
    fontSize="clamp(0.75rem, 2vw, 1rem)"
    fontWeight="semibold"
  >
    {children}
  </ChakraLink>
);

export const GitHubLink = (): ReactElement => (
  <ChakraLink href="https://github.com/budokans/story-typer" isExternal ml={2}>
    <VisuallyHidden>Visit Steven&apos;s GitHub</VisuallyHidden>
    <Icon
      as={RiGithubFill}
      h={[6, 6, 8]}
      w={[6, 6, 8]}
      color="blackAlpha.800"
    />
  </ChakraLink>
);
