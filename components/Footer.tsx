import { FC } from "react";
import {
  Box,
  Flex,
  Link as ChakraLink,
  Text,
  Icon,
  VisuallyHidden,
} from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";
import { FooterCompound } from "./types/Footer.types";

export const Footer: FooterCompound = ({ children }) => {
  return (
    <Container>
      <Inner>{children}</Inner>
    </Container>
  );
};

const Container: FC = ({ children }) => {
  return (
    <Box as="footer" bg="white" w="full" position="absolute" bottom={0}>
      {children}
    </Box>
  );
};

const Inner: FC = ({ children }) => {
  return (
    <Flex
      h={[9, 9, 14]}
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

Footer.Text = function FooterText({ children }) {
  return (
    <Text color="blackAlpha.800" fontSize="clamp(0.75rem, 2vw, 1rem)">
      {children}
    </Text>
  );
};

Footer.NameLink = function FooterNameLink({ children }) {
  return (
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
};

Footer.GitHub = function FooterGitHub() {
  return (
    <ChakraLink
      href="https://github.com/budokans/story-typer"
      isExternal
      ml={2}
    >
      <VisuallyHidden>Visit Steven&apos;s GitHub</VisuallyHidden>
      <Icon
        as={RiGithubFill}
        h={[6, 6, 8]}
        w={[6, 6, 8]}
        color="blackAlpha.800"
      />
    </ChakraLink>
  );
};
