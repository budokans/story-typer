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
  StatsType: React.FC;
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
    <Box
      as="nav"
      position="relative"
      zIndex="2"
      bg="white"
      borderTop="5px solid"
      borderColor="brand.500"
    >
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
      pr={[2, 4, 4, 0]}
      maxW="930px"
      margin="0 auto"
    >
      {children}
    </Flex>
  );
};

const Logo: React.FC = () => {
  return (
    <Box as="li" mr="auto">
      <Link href="/" passHref>
        <Flex
          as="a"
          align="center"
          h={[9, 9, 14]}
          w={[12, 12, 20]}
          justify="center"
        >
          <Heading fontSize={[20, 20, 32]} fontWeight="black">
            ST
          </Heading>
        </Flex>
      </Link>
    </Box>
  );
};

Header.UserMenu = function HeaderUserMenu({ user, children }) {
  return (
    <Box as="li">
      <Menu>
        <MenuButton
          as={Avatar}
          h={[7, 7, 10]}
          w={[7, 7, 10]}
          src={user && user.photoURL}
          cursor="pointer"
        />
        <MenuList fontSize={["xs", "xs", "sm"]}>{children}</MenuList>
      </Menu>
    </Box>
  );
};

Header.StatsContainer = function HeaderStatsContainer({ children }) {
  return (
    <Flex as="li" mr={[3, 3, 5]}>
      {children}
    </Flex>
  );
};

Header.StatsType = function HeaderStatsType({ children }) {
  return (
    <Text
      as="h3"
      mr={2}
      fontSize="clamp(0.75rem, 2.5vw, 1rem)"
      fontWeight="medium"
    >
      {children}
    </Text>
  );
};

Header.Stat = function HeaderStat({ children }) {
  return (
    <Text fontSize="clamp(0.75rem, 2.5vw, 1rem)" fontWeight="semibold">
      {children}
    </Text>
  );
};

Header.Archive = function HeaderArchive() {
  return (
    <Box
      as="li"
      mr={[3, 3, 5]}
      fontSize="clamp(0.75rem, 2.5vw, 1rem)"
      fontWeight="medium"
    >
      <Link href="#" passHref>
        <ChakraLink>Archive</ChakraLink>
      </Link>
    </Box>
  );
};

Header.Favorites = function HeaderFavorites() {
  return (
    <Box as="li" mr={[3, 3, 5]}>
      <Link href="#" passHref>
        <a>
          <Icon as={RiStarFill} h={[7, 7, 8]} w={[7, 7, 8]} />
        </a>
      </Link>
    </Box>
  );
};
