import Link from "next/link";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { User } from "interfaces";

interface Compound {
  UserMenu: React.FC<{ user: User | null }>;
}

type HeaderCC = React.FC & Compound;

export const Header: HeaderCC = ({ children }) => {
  return (
    <Container>
      <Inner>
        <Logo />
        {children}
      </Inner>
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
      justify="space-between"
      h={[9, 9, 14]}
      pr={[1, 4, 0]}
      maxW="930px"
      margin="0 auto"
    >
      {children}
    </Flex>
  );
};

const Logo: React.FC = () => {
  return (
    <Box as="li" bg="white" listStyleType="none">
      <Link href="/" passHref>
        <Flex
          as="a"
          align="center"
          h={[9, 9, 14]}
          w={[12, 12, 20]}
          justify="center"
        >
          <Heading color="purple.500" fontSize={[20, 20, 32]}>
            ST.
          </Heading>
        </Flex>
      </Link>
    </Box>
  );
};

Header.UserMenu = function UserMenu({ user, children }) {
  return (
    <Box as="li" listStyleType="none">
      <Menu>
        <MenuButton
          as={Avatar}
          h={[7, 7, 10]}
          w={[7, 7, 10]}
          src={user && user.photoURL}
          cursor="pointer"
          border="2px solid white"
        />
        <MenuList
          bg="blackAlpha.800"
          color="white"
          fontSize={["xs", "xs", "sm"]}
        >
          {children}
        </MenuList>
      </Menu>
    </Box>
  );
};
