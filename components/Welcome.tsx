import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../public/story-typer-logo.png";

interface Compound {
  Brand: React.FC;
  Headline: React.FC;
}

type WelcomeCC = React.FC & Compound;

export const Welcome: WelcomeCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: React.FC = ({ children }) => {
  return (
    <VStack direction="column" spacing={3} align="center">
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

Welcome.Headline = function WelcomeHeadline({ children }) {
  return (
    <Heading
      as="h2"
      color="black"
      fontSize="clamp(1.25rem, calc(14.40px + 2.00vw), 32px)"
      fontWeight="light"
      lineHeight="sm"
      textAlign="center"
    >
      {children}
    </Heading>
  );
};
