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
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { RiThumbUpFill } from "react-icons/ri";
import logo from "../public/story-typer-logo.png";

interface Compound {
  Brand: React.FC;
  HeadlinesWrapper: React.FC;
  Headline: React.FC;
  CTAWrapper: React.FC;
  CTA: React.FC;
  Benefits: React.FC;
  Benefit: React.FC;
  PlayBtn: React.FC;
  SignInBtn: React.FC;
}

type WelcomeCC = React.FC & Compound;

export const Welcome: WelcomeCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: React.FC = ({ children }) => {
  return (
    <VStack direction="column" spacing={[3, 3, 8]} align="center">
      {children}
    </VStack>
  );
};

Welcome.Brand = function WelcomeBrand() {
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

Welcome.HeadlinesWrapper = function WelcomeHeadlinesWrapper({ children }) {
  return <Box>{children}</Box>;
};

Welcome.Headline = function WelcomeHeadline({ children }) {
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

Welcome.CTAWrapper = function WelcomeCTAWrapper({ children }) {
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

Welcome.CTA = function WelcomeCTA() {
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

Welcome.Benefits = function WelcomeBenefits({ children }) {
  return (
    <List spacing={3} mb={12}>
      {children}
    </List>
  );
};

Welcome.Benefit = function WelcomeBenefit({ children }) {
  return (
    <ListItem fontSize={["1rem", "1rem", "1.25rem"]}>
      <ListIcon as={RiThumbUpFill} mb="3px" />
      {children}
    </ListItem>
  );
};

Welcome.SignInBtn = function WelcomeSignInBtn({ children }) {
  const { signInWithGoogle } = useAuth();

  return (
    <Button
      mb={4}
      w={64}
      h={12}
      _hover={{ bg: "brand.500", color: "white" }}
      variant="outline"
      onClick={() => signInWithGoogle()}
    >
      {children}
    </Button>
  );
};

Welcome.PlayBtn = function WelcomePlayBtn({ children }) {
  const router = useRouter();

  return (
    <Button
      w={64}
      h={12}
      bg="black"
      color="brand.500"
      _hover={{ bg: "blackAlpha.800" }}
      onClick={() => router.push("/play")}
    >
      {children}
    </Button>
  );
};
