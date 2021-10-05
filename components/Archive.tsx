import {
  Context,
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from "react";
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
  PageTitle: FC;
  Toggles: FC<{
    value: "all" | "favorites";
    onSetValue: (nextValue: "all" | "favorites") => void;
  }>;
  Card: FC;
  CardHeader: FC<{ id: number }>;
  CardTitle: FC;
  CardScore: FC;
  CardDate: FC<{ dateString: PrevGame["datePlayed"] }>;
  CardExpandedSection: FC<{ id: number }>;
  FullStory: FC<{ story: PrevGame["storyHtml"] }>;
}

type ArchiveCC = FC & Compound;

interface ExpandedContext {
  expandedIdx: number | null;
  setExpandedIdx: Dispatch<SetStateAction<number | null>>;
}

const expandedContext = createContext<ExpandedContext | null>(null);
const useExpandedContext = (): ExpandedContext =>
  useContext(expandedContext as Context<ExpandedContext>);

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

Archive.PageTitle = function ArchiveHeader({ children }) {
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
      pl={[1, 4, 6]}
    >
      <Stack direction="row">
        <Radio value="all">All</Radio>
        <Radio value="favorites">Favorites</Radio>
      </Stack>
    </RadioGroup>
  );
};

Archive.Card = function ArchiveCard({ children }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <expandedContext.Provider value={{ expandedIdx, setExpandedIdx }}>
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
    </expandedContext.Provider>
  );
};

Archive.CardHeader = function ArchiveCardHeader({ id, children }) {
  const { expandedIdx, setExpandedIdx } = useExpandedContext();
  const isExpanded = expandedIdx === id;

  return (
    <Box
      role="button"
      onClick={() => (isExpanded ? setExpandedIdx(null) : setExpandedIdx(id))}
    >
      <header>{children}</header>
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

Archive.CardExpandedSection = function ArchiveCardExpandedSection({
  id,
  children,
}) {
  const { expandedIdx } = useExpandedContext();
  const isExpanded = expandedIdx === id;

  return isExpanded ? <Box>{children}</Box> : null;
};

Archive.FullStory = function ArchiveFullStroy({ story }) {
  const storyWithPMargins = story.replace(
    /<p/g,
    '<p style="margin-bottom: 1rem"'
  );

  return <Box mt={4}>{parse(storyWithPMargins)}</Box>;
};
