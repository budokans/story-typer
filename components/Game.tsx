import { ChangeEvent, MutableRefObject, useEffect, useRef } from "react";
import {
  Center,
  Container as ChakraContainer,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { RiRestartFill, RiSkipForwardFill } from "react-icons/ri";

interface Compound {
  StoryHeader: React.FC;
  StoryText: React.FC;
  Pad: React.FC;
  Input: React.FC<{
    onInputClick: () => void;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
    error: boolean;
    gameStatus: "idle" | "countdown" | "inGame" | "complete";
  }>;
  ErrorAlert: React.FC;
  BtnSm: React.FC<{ type: "restart" | "new" }>;
  Countdown: React.FC;
  StopWatch: React.FC<{ idle: boolean }>;
}

type GameCC = Compound & React.FC;

export const Game: GameCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: React.FC = ({ children }) => {
  return (
    // 100vh - Header - Footer - <main> paddingY in <LayoutContainer />.
    <Center h={["auto", "calc(100vh - 61px - 56px - 64px)"]}>
      <ChakraContainer px={[2, 6]}>
        <VStack spacing={[4, 6, 8]}>{children}</VStack>
      </ChakraContainer>
    </Center>
  );
};

Game.StoryHeader = function GameStoryHeader({ children }) {
  return <Heading fontSize="clamp(1.25rem, 6vw, 4rem)">{children}</Heading>;
};

Game.StoryText = function GameStoryText({ children }) {
  return <Text fontSize="clamp(1rem, 3vw, 1.25rem)">{children}</Text>;
};

Game.Pad = function GamePad({ children }) {
  return (
    <Flex
      justify="space-between"
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

Game.BtnSm = function GameBtnSm({ type }) {
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
    />
  );
};

Game.Countdown = function GameCountdown({ children }) {
  return (
    <Heading as="h3" color="brand.500">
      {children}
    </Heading>
  );
};

Game.StopWatch = function GameStopWatch({ idle }) {
  return (
    <Heading as="h4" color={idle ? "gray.500" : "blackAlpha.800"}>
      0:34
    </Heading>
  );
};
