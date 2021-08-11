import { Box, Flex, Heading, LinkBox } from "@chakra-ui/react";

interface Compound {
  Logo: React.FC;
}

type HeaderCC = React.FC & Compound;

export const Header: HeaderCC = ({ children }) => {
  return (
    <Container>
      <Inner>{children}</Inner>
    </Container>
  );
};

const Container: React.FC = ({ children }) => {
  return (
    <Box as="nav" bg="blackAlpha.800">
      {children}
    </Box>
  );
};

const Inner: React.FC = ({ children }) => {
  return (
    <Flex
      as="ul"
      align="center"
      h={[9, 9, 14]}
      pr={[2, 4, 0]}
      maxW="930px"
      margin="0 auto"
    >
      {children}
    </Flex>
  );
};

Header.Logo = function HeaderLogo() {
  return (
    <LinkBox as="li" bg="white" listStyleType="none">
      <Flex align="center" h={[9, 9, 14]} w={[12, 12, 20]} justify="center">
        <Heading color="purple.500" fontSize={[20, 20, 32]}>
          ST.
        </Heading>
      </Flex>
    </LinkBox>
  );
};
