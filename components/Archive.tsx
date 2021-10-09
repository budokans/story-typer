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
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import {
  RiArrowLeftSLine,
  RiArrowUpSLine,
  RiDeleteBin2Line,
  RiPlayFill,
} from "react-icons/ri";
import { parseISO, formatDistance } from "date-fns";
import parse from "html-react-parser";
import { useStories } from "@/context/stories";
import { useFavorite } from "@/hooks/useFavorite";
import { ArchiveCompound, ExpandedContext } from "./types/Archive.types";

const expandedContext = createContext<ExpandedContext | null>(null);

const useExpandedContext = (): ExpandedContext =>
  useContext(expandedContext as Context<ExpandedContext>);

export const Archive: ArchiveCompound = ({ children }) => {
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
    <Heading as="h1" fontSize="clamp(2rem, 6vw, 4rem)">
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
        <Radio value="all" cursor="pointer">
          All
        </Radio>
        <Radio value="favorites" cursor="pointer">
          Favorites
        </Radio>
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
        py={[4, 6]}
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
      aria-role={`${isExpanded ? "Hide" : "Show"} game details`}
      onClick={() => (isExpanded ? setExpandedIdx(null) : setExpandedIdx(id))}
      position="relative"
    >
      <header>{children}</header>
    </Box>
  );
};

Archive.CardTitle = function ArchiveCardTitle({ children }) {
  return (
    <Heading as="h2" fontSize="clamp(1rem, 3.5vw, 1.5rem)" noOfLines={1}>
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

Archive.CloseCardIcon = function ArchiveCloseCardIcon({ id }) {
  const { expandedIdx } = useExpandedContext();
  const isExpanded = expandedIdx === id;

  return isExpanded ? (
    <Icon
      as={RiArrowUpSLine}
      aria-label="Hide game details"
      position="absolute"
      left="calc(50% - 1rem)"
      bottom="-5px"
      w="2rem"
      h="2rem"
    />
  ) : null;
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

Archive.Buttons = function ArchiveButtons({ children }) {
  return (
    <HStack spacing={6} justify="center">
      {children}
    </HStack>
  );
};

Archive.PlayAgainButton = function ArchivePlayAgainButton({ storyId }) {
  const { handlePlayArchiveStoryClick } = useStories();

  return (
    <IconButton
      icon={<RiPlayFill />}
      aria-label="Play this story again"
      isRound
      cursor="pointer"
      fontSize="1.75rem"
      bg="lime"
      color="blackAlpha.800"
      onClick={() => {
        handlePlayArchiveStoryClick(storyId);
        router.push("./play");
      }}
    />
  );
};

Archive.DeleteFavoriteButton = function DeleteFavoriteButton({ storyDetails }) {
  const { handleFavoriteClick } = useFavorite(storyDetails);
  const { setExpandedIdx } = useExpandedContext();

  return (
    <IconButton
      icon={<RiDeleteBin2Line />}
      aria-label="Remove from favorites"
      isRound
      cursor="pointer"
      fontSize="1.75rem"
      bg="blackAlpha.400"
      color="blackAlpha.800"
      onClick={() => {
        handleFavoriteClick();
        setExpandedIdx(null);
      }}
    />
  );
};

Archive.BackToGameButton = function ArchiveBackToGameButton() {
  return (
    <Box alignSelf="flex-start" fontSize={["14px", "16px"]}>
      <Link href="/play" passHref>
        <a>
          <Icon as={RiArrowLeftSLine} h="1rem" w="1rem" /> Back to Game
        </a>
      </Link>
    </Box>
  );
};
