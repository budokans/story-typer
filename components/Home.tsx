import { FC } from "react";
import { useAuth } from "@/context/auth";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { RiThumbUpFill } from "react-icons/ri";
import logo from "../public/story-typer-logo.png";
import { HomeCompound } from "./types/Home.types";

export const Home: HomeCompound = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: FC = ({ children }) => {
  return (
    <VStack direction="column" spacing={[3, 3, 8]} align="center">
      {children}
    </VStack>
  );
};

Home.Brand = function HomeBrand() {
  return (
    <Flex direction="column" align="center" mt={[-5, -10]}>
      <Box w="clamp(8rem, 30vw, 16rem)" h="clamp(8rem, 30vw, 16rem)">
        <Image src={logo} alt="Story Typer Logo" priority />
      </Box>
      <Heading
        as="h1"
        mt={[4, 4, 8]}
        fontSize="clamp(2.5rem, calc(6vw + 14px), 6rem)"
        fontWeight={["light", "light", "hairline"]}
        color="brand.700"
      >
        STORY TYPER
      </Heading>
    </Flex>
  );
};

Home.HeadlinesWrapper = function HomeHeadlinesWrapper({ children }) {
  return <Box>{children}</Box>;
};

Home.Headline = function HomeHeadline({ children }) {
  return (
    <Heading
      as="h2"
      color="black"
      fontSize="clamp(1.25rem, calc(14.40px + 2.00vw), 32px)"
      fontWeight="light"
      lineHeight="sm"
      textAlign="center"
      mb={2}
    >
      {children}
    </Heading>
  );
};

Home.CTAWrapper = function HomeCTAWrapper({ children }) {
  return (
    <Center bg="white" w="100vw">
      <Flex
        direction="column"
        align="center"
        py={[8, 12, 16]}
        px={[2, 4, 4, 0]}
        maxW="930px"
      >
        {children}
      </Flex>
    </Center>
  );
};

Home.CTA = function HomeCTA() {
  const { signInWithGoogle } = useAuth();

  return (
    <Heading
      as="h3"
      fontWeight="regular"
      fontSize="clamp(1.25rem, calc(14.40px + 2.00vw), 28px)"
      mb={[4, 4, 6]}
      textAlign="center"
    >
      <Text
        as="strong"
        onClick={() => signInWithGoogle()}
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
      >
        Sign in
      </Text>{" "}
      to
    </Heading>
  );
};

Home.Benefits = function HomeBenefits({ children }) {
  return (
    <List spacing={3} mb={12}>
      {children}
    </List>
  );
};

Home.Benefit = function HomeBenefit({ children }) {
  return (
    <ListItem fontSize={["1rem", "1rem", "1.25rem"]}>
      <ListIcon as={RiThumbUpFill} mb="3px" />
      {children}
    </ListItem>
  );
};

Home.PlayBtn = function HomePlayBtn({ onClick, children }) {
  return (
    <Button
      w={64}
      h={12}
      bg="black"
      color="brand.500"
      _hover={{ bg: "blackAlpha.800" }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
