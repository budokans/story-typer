import { ReactElement } from "react";
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
  Icon,
} from "@chakra-ui/react";
import { RiStarFill } from "react-icons/ri";
import { ChildrenProps } from "components";
import { Styles } from "@/styles";
import { ArchiveQuery } from "./util.types";

export const Header = ({ children }: ChildrenProps): ReactElement => (
  <Container>
    <Inner>
      <Logo />
      {children}
    </Inner>
  </Container>
);

const Container = ({ children }: ChildrenProps): ReactElement => (
  <Box
    as="header"
    h={[
      `${Styles.headerHeightMobile}px`,
      `${Styles.headerHeightMobile}px`,
      `${Styles.headerHeightDesktop}px`,
    ]}
  >
    <Box
      as="nav"
      position="relative"
      zIndex="2"
      bg="white"
      borderTop={`${Styles.headerBorderHeight}px solid`}
      borderColor="brand.500"
      h="100%"
    >
      {children}
    </Box>
  </Box>
);

const Inner = ({ children }: ChildrenProps): ReactElement => (
  <Flex
    as="ul"
    align="center"
    justify="space-between"
    h="100%"
    px={[2, 4, 4, 0]}
    maxW="930px"
    margin="0 auto"
  >
    {children}
  </Flex>
);

const Logo = (): ReactElement => (
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

interface UserMenuProps {
  readonly photoURL?: string | null;
}

export const UserMenu = ({
  photoURL,
  children,
}: UserMenuProps & ChildrenProps): ReactElement => (
  <Box as="li">
    <Menu>
      <MenuButton>
        <Avatar
          h={[7, 7, 10]}
          w={[7, 7, 10]}
          cursor="pointer"
          bg="brand.800"
          color="white"
          // This will default to a generic avatar image if user.photoURL is
          // nullish
          {...(photoURL ? { src: photoURL } : {})}
        />
      </MenuButton>
      <MenuList fontSize={["sm", "sm", "md"]}>{children}</MenuList>
    </Menu>
  </Box>
);

export const StatsContainer = ({ children }: ChildrenProps): ReactElement => (
  <Flex as="li" mr={[3, 3, 5]}>
    {children}
  </Flex>
);

export const StatsType = ({ children }: ChildrenProps): ReactElement => (
  <Text
    as="h3"
    mr={2}
    fontSize="clamp(0.75rem, 2.5vw, 1rem)"
    fontWeight="medium"
  >
    {children}
  </Text>
);

export const Stat = ({ children }: ChildrenProps): ReactElement => (
  <Text fontSize="clamp(0.75rem, 2.5vw, 1rem)" fontWeight="semibold">
    {children}
  </Text>
);

export const Archive = (): ReactElement => {
  const query: ArchiveQuery = { location: "archive" };

  return (
    <Box
      as="li"
      mr={[3, 3, 5]}
      fontSize="clamp(0.75rem, 2.5vw, 1rem)"
      fontWeight="medium"
    >
      <Link
        href={{
          pathname: "/game",
          query,
        }}
      >
        Previous
      </Link>
    </Box>
  );
};

export const Favorites = (): ReactElement => {
  const query: ArchiveQuery = { location: "archive", favorites: "true" };

  return (
    <Box as="li" mr={[3, 3, 5]}>
      <Link
        href={{
          pathname: "/game",
          query,
        }}
        passHref
      >
        <a>
          <Icon as={RiStarFill} h={[7, 7, 8]} w={[7, 7, 8]} />
        </a>
      </Link>
    </Box>
  );
};
