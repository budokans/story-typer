import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../public/story-typer-logo.png";

interface Compound {
  Brand: React.FC;
}

type WelcomeCC = React.FC & Compound;

export const Welcome: WelcomeCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: React.FC = ({ children }) => {
  return (
    <VStack direction="column" spacing={6} align="center">
      {children}
    </VStack>
  );
};

Welcome.Brand = function WelcomeBrand({ children }) {
  return (
    <Flex direction="column" align="center" mt={[-2, -4]}>
      <Box w="clamp(8rem, 30vw, 16rem)" h="clamp(8rem, 30vw, 16rem)">
        <Image src={logo} alt="Story Typer Logo" priority />
      </Box>
      <Heading
        as="h1"
        mb={2}
        fontSize="clamp(2.5rem, calc(6vw + 14px), 6rem)"
        fontWeight="light"
        color="brand.700"
      >
        STORY TYPER
      </Heading>
    </Flex>
  );
};
