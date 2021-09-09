import Link from "next/link";
import Image from "next/image";
import logo from "../public/story-typer-logo.png";
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Link as ChakraLink,
  Icon,
} from "@chakra-ui/react";
import { RiStarFill } from "react-icons/ri";
import { useUser } from "@/context/user";

interface Compound {
  UserMenu: React.FC;
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
      px={[2, 4, 4, 0]}
      maxW="930px"
      margin="0 auto"
    >
      {children}
    </Flex>
  );
};

const Logo: React.FC = () => {
  return (
    <Box
      as="li"
      mr="auto"
      h={["1.85rem", "1.85rem", "3rem"]}
      w={["1.85rem", "1.85rem", "3rem"]}
      alignSelf="flex-start"
    >
      <Link href="/">
        <a>
          <Image src={logo} alt="Story Typer Logo" priority />
        </a>
      </Link>
    </Box>
  );
};

Header.UserMenu = function HeaderUserMenu({ children }) {
  const user = useUser();

  return (
    <Box as="li">
      <Menu>
        <MenuButton
          as={Avatar}
          h={[7, 7, 10]}
          w={[7, 7, 10]}
          src={user?.photoURL}
          cursor="pointer"
        />
        <MenuList fontSize={["sm", "sm", "md"]}>{children}</MenuList>
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
      <ChakraLink as={Link} href="#" passHref>
        Archive
      </ChakraLink>
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
