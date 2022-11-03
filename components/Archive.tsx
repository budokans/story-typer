import { ReactElement } from "react";
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
import { useStoriesContext } from "@/context/stories";
import { useFavorite } from "@/hooks";
import { ChildrenProps, FavoriteBase } from "interfaces";
import {
  CardIsExpandedProvider,
  useCardIsExpandedContext,
} from "@/context/cardIsExpanded";

type ArchiveFilter = "all" | "favorites";

interface TogglesProps {
  readonly filter: ArchiveFilter;
  readonly onSetFilter: (filter: ArchiveFilter) => void;
}

interface CardDateProps {
  readonly dateString: string;
}

interface StoryProps {
  readonly story: string;
}

interface PlayAgainButtonProps {
  readonly storyId: string;
}

interface DeleteFavoriteButtonProps {
  readonly storyDetails: FavoriteBase;
}

export const Archive = ({ children }: ChildrenProps): ReactElement => {
  return <Container>{children}</Container>;
};

const Container = ({ children }: ChildrenProps): ReactElement => {
  return (
    <ChakraContainer px={[0, 2, 6]}>
      <VStack spacing={4}>{children}</VStack>
    </ChakraContainer>
  );
};

export const Header = ({ children }: ChildrenProps): ReactElement => (
  <Heading as="h1" fontSize="clamp(2rem, 6vw, 4rem)">
    {children}
  </Heading>
);

export const Toggles = ({
  filter,
  onSetFilter,
}: TogglesProps): ReactElement => (
  <RadioGroup
    onChange={onSetFilter}
    value={filter}
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

export const Card = ({ children }: ChildrenProps): ReactElement => {
  return (
    <CardIsExpandedProvider>
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
    </CardIsExpandedProvider>
  );
};

export const CardHeader = ({ children }: ChildrenProps): ReactElement => {
  const { isExpanded, setIsExpanded } = useCardIsExpandedContext();

  return (
    <Box
      role="button"
      aria-role={`${isExpanded ? "Hide" : "Show"} game details`}
      onClick={() => (isExpanded ? setIsExpanded(false) : setIsExpanded(true))}
      position="relative"
    >
      <header>{children}</header>
    </Box>
  );
};

export const CardTitle = ({ children }: ChildrenProps): ReactElement => (
  <Heading as="h2" fontSize="clamp(1rem, 3.5vw, 1.5rem)" noOfLines={1}>
    {children}
  </Heading>
);

export const CardScore = ({ children }: ChildrenProps): ReactElement => (
  <Text fontSize="sm">Score: {children} WPM</Text>
);

export const CardDate = ({ dateString }: CardDateProps): ReactElement => {
  const iso = parseISO(dateString);
  return (
    <time dateTime={dateString} style={{ fontSize: ".75rem" }}>
      {formatDistance(iso, new Date())} ago
    </time>
  );
};

export const CloseCardIcon = (): ReactElement | null => {
  const { isExpanded } = useCardIsExpandedContext();

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

export const CardExpandedSection = ({
  children,
}: ChildrenProps): ReactElement | null => {
  const { isExpanded } = useCardIsExpandedContext();

  return isExpanded ? <Box>{children}</Box> : null;
};

export const Story = ({ story }: StoryProps): ReactElement => {
  const storyWithPMargins = story.replace(
    /<p/g,
    '<p style="margin-bottom: 1rem"'
  );

  return <Box mt={4}>{parse(storyWithPMargins)}</Box>;
};

export const Buttons = ({ children }: ChildrenProps): ReactElement => (
  <HStack spacing={6} justify="center">
    {children}
  </HStack>
);

export const PlayAgainButton = ({
  storyId,
}: PlayAgainButtonProps): ReactElement => {
  const { handlePlayArchiveStoryClick } = useStoriesContext();

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

export const DeleteFavoriteButton = ({
  storyDetails,
}: DeleteFavoriteButtonProps): ReactElement => {
  const { handleFavoriteClick } = useFavorite(storyDetails);
  const { setIsExpanded } = useCardIsExpandedContext();

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
        setIsExpanded(false);
      }}
    />
  );
};

export const BackToGameButton = (): ReactElement => (
  <Box alignSelf="flex-start" fontSize={["14px", "16px"]}>
    <Link href="/play" passHref>
      <a>
        <Icon as={RiArrowLeftSLine} h="1rem" w="1rem" /> Back to Game
      </a>
    </Link>
  </Box>
);
