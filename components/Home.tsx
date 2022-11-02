import { ReactElement } from "react";
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
import { ChildrenProps } from "interfaces";

interface PlayButtonProps {
  readonly onClick: () => void;
}

export const Home = ({ children }: ChildrenProps): ReactElement => (
  <Container>{children}</Container>
);

const Container = ({ children }: ChildrenProps): ReactElement => (
  <VStack direction="column" spacing={[3, 3, 8]} align="center">
    {children}
  </VStack>
);

export const Brand = (): ReactElement => (
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

export const HeadlinesWrapper = ({ children }: ChildrenProps): ReactElement => (
  <Box textAlign="center">{children}</Box>
);

export const Headline = ({ children }: ChildrenProps): ReactElement => (
  <Heading
    as="h2"
    color="black"
    fontSize="clamp(1.25rem, calc(14.40px + 2.00vw), 32px)"
    fontWeight="light"
    lineHeight="sm"
    mb={2}
  >
    {children}
  </Heading>
);

export const FeaturesWrapper = ({ children }: ChildrenProps): ReactElement => (
  <Center bg="white" w="100vw">
    <Flex
      direction="column"
      align="center"
      py={[8, 12]}
      px={[2, 4, 4, 0]}
      maxW="930px"
    >
      {children}
    </Flex>
  </Center>
);

export const FeaturesHeading = (): ReactElement => (
  <Heading
    as="h3"
    fontWeight="regular"
    fontSize="clamp(1.25rem, calc(14.40px + 2.00vw), 28px)"
    mb={[4, 4, 6]}
    textAlign="center"
  >
    <Text as="strong">Features</Text>
  </Heading>
);

export const Features = ({ children }: ChildrenProps): ReactElement => (
  <List spacing={3}>{children}</List>
);

export const Feature = ({ children }: ChildrenProps): ReactElement => (
  <ListItem fontSize={["1rem", "1rem", "1.25rem"]}>
    <ListIcon as={RiThumbUpFill} mb="3px" />
    {children}
  </ListItem>
);

export const PlayButton = ({
  onClick,
  children,
}: PlayButtonProps & ChildrenProps): ReactElement => (
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
