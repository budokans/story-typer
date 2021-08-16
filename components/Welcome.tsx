import {
  Box,
  Center,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { RiThumbUpFill } from "react-icons/ri";
import logo from "../public/story-typer-logo.png";

interface Compound {
  Brand: React.FC;
  HeadlinesContainer: React.FC;
  Headline: React.FC;
  Benefits: React.FC;
  Benefit: React.FC;
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
    <Flex direction="column" align="center" mt={[-3, -4]}>
      <Box w="clamp(8rem, 30vw, 16rem)" h="clamp(8rem, 30vw, 16rem)">
        <Image src={logo} alt="Story Typer Logo" priority />
      </Box>
      <Heading
        as="h1"
        my={2}
        fontSize="clamp(2.5rem, calc(6vw + 14px), 6rem)"
        fontWeight={["light", "light", "hairline"]}
        color="brand.700"
      >
        STORY TYPER
      </Heading>
    </Flex>
  );
};

Welcome.HeadlinesContainer = function WelcomeHeadlinesContainer({ children }) {
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

Welcome.Benefits = function WelcomeBenefits({ children }) {
  return (
    <Center bg="white" w="100vw">
      <Box py={[8, 12, 16]} px={[2, 4, 4, 0]} maxW="930px">
        <Heading
          as="h3"
          fontWeight="regular"
          fontSize="clamp(1.25rem, calc(14.40px + 2.00vw), 28px)"
          mb={[4, 4, 6]}
          textAlign="center"
        >
          <strong>Sign in</strong> to
        </Heading>
        <List spacing={3}>{children}</List>
      </Box>
    </Center>
  );
};

Welcome.Benefit = function WelcomeBenefit({ children }) {
  return (
    <ListItem fontSize={["1rem", "1rem", "1.25rem"]}>
      <ListIcon as={RiThumbUpFill} />
      {children}
    </ListItem>
  );
};
