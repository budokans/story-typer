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
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  function as F,
  string as Str,
  taskEither as TE,
  task as T,
  option as O,
  readonlyArray as A,
  io as IO,
} from "fp-ts";
import {
  RiArrowLeftSLine,
  RiArrowUpSLine,
  RiDeleteBin2Line,
  RiPlayFill,
} from "react-icons/ri";
import { parseISO, formatDistance } from "date-fns";
import domToReact from "html-react-parser";
import {
  Stories as StoriesContext,
  CardIsExpanded as CardContext,
} from "context";
import { Favorite as FavoriteAPI, Story as StoryAPI } from "api-client";
import { ChildrenProps, Spinner } from "components";
import { ArchiveQuery } from "./util.types";

interface CardDateProps {
  readonly dateString: string;
}

interface StoryProps {
  readonly story: string;
}

interface DeleteFavoriteButtonProps {
  readonly id: string;
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

export const Toggles = (): ReactElement => {
  const router = useRouter();
  const query: ArchiveQuery = {
    location: "archive",
    ...(router.query.favorites ? {} : { favorites: "true" }),
  };

  return (
    <RadioGroup
      onChange={() => {
        router.push({
          pathname: "/game",
          query,
        });
      }}
      value={router.query.favorites ? "favorites" : "all"}
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

export const Card = ({ children }: ChildrenProps): ReactElement => (
  <CardContext.CardIsExpandedProvider>
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
  </CardContext.CardIsExpandedProvider>
);

export const CardHeader = ({ children }: ChildrenProps): ReactElement => {
  const { isExpanded, setIsExpanded } = CardContext.useCardIsExpandedContext();

  return (
    <Box
      role="button"
      aria-label={`${isExpanded ? "Hide" : "Show"} game details`}
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

export const CardDate = ({ dateString }: CardDateProps): ReactElement =>
  F.pipe(
    // Force new line
    dateString,
    parseISO,
    (iso) => (
      <time dateTime={dateString} style={{ fontSize: ".75rem" }}>
        {formatDistance(iso, new Date())} ago
      </time>
    )
  );

export const CloseCardIcon = (): ReactElement | null => {
  const { isExpanded } = CardContext.useCardIsExpandedContext();

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
  const { isExpanded } = CardContext.useCardIsExpandedContext();

  return isExpanded ? <Box>{children}</Box> : null;
};

export const Story = ({ story }: StoryProps): ReactElement =>
  F.pipe(
    story,
    Str.replace(/<p/g, '<p style="margin-bottom: 1rem"'),
    domToReact,
    (parsedStory) => <Box mt={4}>{parsedStory}</Box>
  );

export const Buttons = ({ children }: ChildrenProps): ReactElement => (
  <HStack spacing={6} justify="center">
    {children}
  </HStack>
);

interface PlayAgainButtonProps {
  readonly storyId: string;
}

// TODO: Fix multiple error toasts for queries with same QueryKey.
// This happens when multiple PlayAgainButtons with the same storyId are rendered
// when the query runs. The query hook's return value changes, rerendering both components.

// Solution: There's no need to render both buttons. Close any other card with a given storyId
// when expanding another card with that storyId.
export const PlayAgainButton = ({
  storyId,
}: PlayAgainButtonProps): ReactElement => {
  const router = useRouter();
  const toast = useToast();
  const { stories, setStories, currentStoryIdx } =
    StoriesContext.useStoriesContext();
  const toastIO = (): IO.IO<void> => () =>
    toast({
      title: "Sorry, we could not find that story.",
      description: "Please try another story or return to game.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });

  const { refetch, isFetching } = StoryAPI.useStory(storyId, {
    enabled: false,
    onSuccess: F.flow(
      O.fromNullable,
      O.chain(
        F.flow(
          // Force new line
          StoryAPI.serializeStory,
          (serialized) => A.insertAt(currentStoryIdx, serialized)(stories)
        )
      ),
      O.matchW(
        // Force new line
        toastIO,
        (data) =>
          F.pipe(
            () => setStories(data),
            IO.chainFirst(() => () => router.push("/game"))
          )
      ),
      (unsafePerformIO) => unsafePerformIO()
    ),
    onError: F.flow(
      (error) => () => console.error(error),
      IO.chain(toastIO),
      (unsafePerformIO) => unsafePerformIO()
    ),
  });

  return (
    <IconButton
      icon={isFetching ? <Spinner size="md" /> : <RiPlayFill />}
      aria-label="Play this story again"
      isRound
      cursor="pointer"
      fontSize="1.75rem"
      bg={isFetching ? "gold" : "lime"}
      color="blackAlpha.800"
      onClick={refetch}
    />
  );
};

export const DeleteFavoriteButton = ({
  id,
}: DeleteFavoriteButtonProps): ReactElement => {
  const deleteFavoriteAPI = FavoriteAPI.useDeleteFavorite();

  return (
    <IconButton
      icon={
        deleteFavoriteAPI.isLoading ? (
          <Spinner size="lg" color="gold" />
        ) : (
          <RiDeleteBin2Line />
        )
      }
      aria-label="Remove from favorites"
      isRound
      cursor="pointer"
      fontSize="1.75rem"
      bg="blackAlpha.400"
      color="blackAlpha.800"
      onClick={() =>
        F.pipe(
          deleteFavoriteAPI.mutateAsync(id),
          TE.fold(
            F.flow(
              // Force new line
              (error) => () => console.error(error),
              T.fromIO
            ),
            () => T.of(undefined)
          )
        )()
      }
    />
  );
};

export const BackToGameButton = (): ReactElement => (
  <Box alignSelf="flex-start" fontSize={["14px", "16px"]}>
    <Link href="/game" passHref>
      <a>
        <Icon as={RiArrowLeftSLine} h="1rem" w="1rem" /> Back to Game
      </a>
    </Link>
  </Box>
);
