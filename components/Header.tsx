import Link from "next/link";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Link as ChakraLink,
  Icon,
} from "@chakra-ui/react";
import { RiStarFill } from "react-icons/ri";
import { User } from "interfaces";

interface Compound {
  UserMenu: React.FC<{ user: User | null }>;
  StatsContainer: React.FC;
  StatsHeader: React.FC;
  Stat: React.FC;
  Favorites: React.FC;
  Archive: React.FC;
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
    <Box as="li" bg="white" listStyleType="none" mr="auto">
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

Header.UserMenu = function HeaderUserMenu({ user, children }) {
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

Header.StatsContainer = function HeaderStatsContainer({ children }) {
  return <Flex mr={[3, 3, 5]}>{children}</Flex>;
};

Header.StatsHeader = function StatsHeader({ children }) {
  return (
    <Text
      as="h3"
      color="white"
      mr={2}
      fontWeight="semibold"
      fontSize="clamp(0.75rem, 2vw, 1rem)"
    >
      {children}
    </Text>
  );
};

Header.Stat = function HeaderStat({ children }) {
  return (
    <Text
      color="pink.400"
      fontWeight="semibold"
      fontSize="clamp(0.75rem, 2vw, 1rem)"
    >
      {children}
    </Text>
  );
};

Header.Archive = function HeaderArchive() {
  return (
    <Box as="li" listStyleType="none" mr={[3, 3, 5]}>
      <Link href="#" passHref>
        <ChakraLink
          color="white"
          fontWeight="semibold"
          fontSize="clamp(0.75rem, 2vw, 1rem)"
          _hover={{ textDecoration: "none" }}
        >
          Archive
        </ChakraLink>
      </Link>
    </Box>
  );
};

Header.Favorites = function HeaderFavorites() {
  return (
    <Box as="li" listStyleType="none" mr={[3, 3, 5]}>
      <Link href="#" passHref>
        <a>
          <Icon as={RiStarFill} color="#FFD700" h={[6, 6, 8]} w={[6, 6, 8]} />
        </a>
      </Link>
    </Box>
  );
};
