import { ChangeEvent, MutableRefObject, useEffect, useRef } from "react";
import {
  Center,
  Container as ChakraContainer,
  Flex,
  Heading,
  IconButton,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import {
  RiRestartFill,
  RiSkipForwardFill,
  RiStarFill,
  RiStarLine,
} from "react-icons/ri";
import { GameState } from "@/hooks/useGame.types";

interface Compound {
  Skeleton: React.FC<{ isLargeViewport: boolean }>;
  StoryHeader: React.FC<{ isLargeViewport: boolean }>;
  StoryText: React.FC;
  Pad: React.FC;
  Input: React.FC<{
    onInputClick: () => void;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
    error: boolean;
    gameStatus: GameState["status"];
  }>;
  ErrorAlert: React.FC;
  BtnSm: React.FC<{ type: "restart" | "new"; onClick: () => void }>;
  Countdown: React.FC<{
    active?: boolean;
  }>;
  StopWatch: React.FC<{
    gameStatus: GameState["status"];
  }>;
  Score: React.FC;
  Favorite: React.FC<{
    isFavorited: boolean | undefined;
    onFavoriteClick: () => void;
  }>;
}

type GameCC = Compound & React.FC;

export const Game: GameCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: React.FC = ({ children }) => {
  return (
    // 100vh - Header - Footer - <main> paddingY in <LayoutContainer />.
    <Center minH={["auto", "calc(100vh - 61px - 56px - 64px)"]}>
      <ChakraContainer px={[2, 6]}>
        <VStack spacing={[4, 6, 8]}>{children}</VStack>
      </ChakraContainer>
    </Center>
  );
};

Game.Skeleton = function GameSkeleton({ isLargeViewport }) {
  return (
    <>
      {/* <Game.StoryHeader> */}
      {isLargeViewport && (
        <>
          <Skeleton height="35px" w="50%" alignSelf="flex-start" />
          <Skeleton height="35px" w="90%" alignSelf="flex-start" />
          <Skeleton height="35px" w="75%" alignSelf="flex-start" />
        </>
      )}

      {/* <Game.StoryText> */}
      <Skeleton height="15px" w="80%" alignSelf="flex-start" />
      <Skeleton height="15px" w="90%" alignSelf="flex-start" />
      <Skeleton height="15px" w="80%" alignSelf="flex-start" />
      <Skeleton height="15px" w="95%" alignSelf="flex-start" />
      <Skeleton height="15px" w="65%" alignSelf="flex-start" />

      <Game.Pad>
        <Skeleton
          height="40px"
          w={["20ch", "20ch", "30ch"]}
          my={4}
          mr="auto"
          borderRadius="md"
        />
        <SkeletonCircle size="10" ml={3} />
        <SkeletonCircle size="10" ml={3} />
      </Game.Pad>
    </>
  );
};

Game.StoryHeader = function GameStoryHeader({ isLargeViewport, children }) {
  return isLargeViewport ? (
    <Heading fontSize="clamp(1.25rem, 6vw, 4rem)">{children}</Heading>
  ) : null;
};

Game.StoryText = function GameStoryText({ children }) {
  return <Text fontSize="clamp(1rem, 3vw, 1.25rem)">{children}</Text>;
};

Game.Pad = function GamePad({ children }) {
  return (
    <Flex
      justify="space-between"
      align="center"
      w={["100vw", "100%"]}
      bg="blackAlpha.800"
      borderRadius={["none", "xl"]}
      px={[3, 6]}
      py={[4, 6]}
      boxShadow="4px 4px 6px grey"
    >
      {children}
    </Flex>
  );
};

Game.Input = function GameInput({
  onInputClick,
  onInputChange,
  value,
  gameStatus,
  error,
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = inputRef as MutableRefObject<HTMLInputElement>;
    gameStatus === "inGame" && input.current.focus();
  }, [gameStatus]);

  return (
    <Input
      placeholder={gameStatus === "idle" ? "Click here to begin" : ""}
      bg={error ? "red.300" : "white"}
      w="clamp(12rem, 50vw, 20rem)"
      mr="auto"
      onClick={onInputClick}
      onChange={onInputChange}
      value={value}
      disabled={gameStatus === "countdown"}
      ref={inputRef}
    />
  );
};

Game.ErrorAlert = function ErrorAlert() {
  return (
    <WarningIcon
      w={10}
      h={10}
      color="red.300"
      border="2px solid white"
      borderRadius="100%"
      bg="white"
    />
  );
};

Game.BtnSm = function GameBtnSm({ type, onClick }) {
  return (
    <IconButton
      icon={type === "restart" ? <RiRestartFill /> : <RiSkipForwardFill />}
      aria-label={type === "restart" ? "Restart game" : "Next story"}
      isRound
      cursor="pointer"
      ml={3}
      fontSize="1.75rem"
      bg={type === "restart" ? "gold" : "lime"}
      color="blackAlpha.800"
      onClick={onClick}
    />
  );
};

Game.Countdown = function GameCountdown({ active, children }) {
  return (
    <Heading as="h3" color={active ? "brand.500" : "blackAlpha.800"}>
      {children}
    </Heading>
  );
};

Game.StopWatch = function GameStopWatch({ gameStatus, children }) {
  return (
    <Heading
      as="h4"
      color={
        gameStatus === "idle" || gameStatus === "complete"
          ? "gray.500"
          : "blackAlpha.800"
      }
    >
      {children}
    </Heading>
  );
};

Game.Score = function GameScore({ children }) {
  return (
    <Text mr="auto" color="white" fontWeight="semibold" fontSize="1.5rem">
      {children}
    </Text>
  );
};

Game.Favorite = function GameFavorite({ isFavorited, onFavoriteClick }) {
  return (
    <IconButton
      icon={isFavorited ? <RiStarFill /> : <RiStarLine />}
      isRound
      cursor="pointer"
      fontSize="2.5rem"
      aria-label="favorite this story"
      bg="transparent"
      color="gold"
      onClick={onFavoriteClick}
      _hover={{ background: "transparent" }}
      _focus={{ boxShadow: "none" }}
    />
  );
};
