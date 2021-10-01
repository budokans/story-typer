import { FC } from "react";
import {
  Container as ChakraContainer,
  Heading,
  VStack,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import { parseISO, formatDistance } from "date-fns";
import parse from "html-react-parser";
import { PrevGame } from "interfaces";

interface Compound {
  Header: FC;
  Toggles: FC<{
    value: "all" | "favorites";
    onSetValue: (nextValue: "all" | "favorites") => void;
  }>;
  Card: FC;
  CardTitle: FC;
  CardScore: FC;
  CardDate: FC<{ dateString: PrevGame["datePlayed"] }>;
  FullStory: FC<{ story: PrevGame["storyHtml"] }>;
}

type ArchiveCC = FC & Compound;

export const Archive: ArchiveCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: FC = ({ children }) => {
  return (
    <ChakraContainer px={[0, 2, 6]}>
      <VStack spacing={4}>{children}</VStack>
    </ChakraContainer>
  );
};

Archive.Header = function ArchiveHeader({ children }) {
  return (
    <Heading as="h1" fontSize="clamp(1.5rem, 6vw, 4rem)">
      {children}
    </Heading>
  );
};

Archive.Toggles = function ArchiveToggles({ value, onSetValue }) {
  return (
    <RadioGroup
      onChange={onSetValue}
      value={value}
      alignSelf="flex-start"
      pl={[1, 0]}
    >
      <Stack direction="row">
        <Radio value="all">All</Radio>
        <Radio value="favorites">Favorites</Radio>
      </Stack>
    </RadioGroup>
  );
};

Archive.Card = function ArchiveCard({ children }) {
  return (
    <Box
      w={["100vw", "100%"]}
      bg="white"
      px={[2, 4, 6]}
      py={[3, 6]}
      borderRadius={["none", "lg"]}
      boxShadow="2px 2px 4px rgba(0, 0, 0, 0.1)"
    >
      {children}
    </Box>
  );
};

Archive.CardTitle = function ArchiveCardTitle({ children }) {
  return (
    <Heading as="h2" fontSize="clamp(1rem, 3.5vw, 1.5rem)">
      {children}
    </Heading>
  );
};

Archive.CardScore = function ArchiveCardScore({ children }) {
  return <Text fontSize="sm">Score: {children} WPM</Text>;
};

Archive.CardDate = function ArchiveCardDate({ dateString }) {
  const iso = parseISO(dateString);
  return (
    <time dateTime={dateString} style={{ fontSize: ".75rem" }}>
      {formatDistance(iso, new Date())} ago
    </time>
  );
};

Archive.FullStory = function ArchiveFullStroy({ story }) {
  return <Text mt={4}>{parse(story)}</Text>;
};
