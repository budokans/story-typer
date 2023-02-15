import { useEffect, useRef, ReactElement, ChangeEvent } from "react";
import {
  Container as ChakraContainer,
  Flex,
  Heading,
  IconButton,
  Input as ChakraInput,
  Skeleton as ChakraSkeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { RiRestartFill, RiSkipForwardFill } from "react-icons/ri";
import { ChildrenProps } from "components";
import { GameStatus } from "@/reducers/GameReducer";

export const Game = ({ children }: ChildrenProps): ReactElement => (
  <Container>{children}</Container>
);

const Container = ({ children }: ChildrenProps) => (
  <ChakraContainer px={[2, 6]}>
    <VStack spacing={[4, 6, 8]}>{children}</VStack>
  </ChakraContainer>
);

interface SkeletonProps {
  readonly isLargeViewport: boolean;
}

export const Skeleton = ({ isLargeViewport }: SkeletonProps): ReactElement => (
  <>
    {/* <Game.StoryHeader> */}
    {isLargeViewport && (
      <>
        <ChakraSkeleton height="35px" w="50%" alignSelf="flex-start" />
        <ChakraSkeleton height="35px" w="90%" alignSelf="flex-start" />
        <ChakraSkeleton height="35px" w="75%" alignSelf="flex-start" />
      </>
    )}

    {/* <Game.StoryText> */}
    <ChakraSkeleton height="15px" w="80%" alignSelf="flex-start" />
    <ChakraSkeleton height="15px" w="90%" alignSelf="flex-start" />
    <ChakraSkeleton height="15px" w="80%" alignSelf="flex-start" />
    <ChakraSkeleton height="15px" w="95%" alignSelf="flex-start" />
    <ChakraSkeleton height="15px" w="65%" alignSelf="flex-start" />

    <Pad>
      <ChakraSkeleton
        height="40px"
        w={["20ch", "20ch", "30ch"]}
        my={4}
        mr="auto"
        borderRadius="md"
      />
      <SkeletonCircle size="10" ml={3} />
      <SkeletonCircle size="10" ml={3} />
    </Pad>
  </>
);

interface StoryHeaderProps {
  readonly isLargeViewport: boolean;
}

export const StoryHeader = ({
  isLargeViewport,
  children,
}: StoryHeaderProps & ChildrenProps): ReactElement | null =>
  isLargeViewport ? (
    <Heading fontSize="clamp(1.25rem, 6vw, 4rem)">{children}</Heading>
  ) : null;

export const StoryText = ({ children }: ChildrenProps): ReactElement => (
  <Text fontSize="clamp(1rem, 3vw, 1.25rem)">{children}</Text>
);

export const Pad = ({ children }: ChildrenProps): ReactElement => (
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

interface InputProps {
  readonly onInputClick: () => void;
  readonly onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly value: string;
  readonly error: boolean;
  readonly gameStatus: GameStatus;
}

export const Input = ({
  onInputClick,
  onInputChange,
  value,
  gameStatus,
  error,
}: InputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    gameStatus === "inGame" && inputRef?.current?.focus();
  }, [gameStatus]);

  return (
    <ChakraInput
      placeholder={gameStatus === "idle" ? "Click here to begin" : ""}
      bg={error ? "red.300" : "white"}
      w="clamp(12rem, 50vw, 20rem)"
      mr="auto"
      onClick={onInputClick}
      onChange={onInputChange}
      value={value}
      disabled={gameStatus === "countdown"}
      ref={inputRef}
      autoCapitalize="off"
      autoComplete="off"
      onPaste={(e) => e.preventDefault()}
    />
  );
};

export const ErrorAlert = (): ReactElement => (
  <WarningIcon
    w={10}
    h={10}
    color="red.300"
    border="2px solid white"
    borderRadius="100%"
    bg="white"
  />
);

interface NewGameButtonProps {
  readonly type: "restart" | "new";
  readonly onClick: () => void;
}

export const NewGameButton = ({
  type,
  onClick,
}: NewGameButtonProps): ReactElement => (
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

interface CountdownProps {
  readonly isActive: boolean;
}

export const Countdown = ({
  isActive,
  children,
}: CountdownProps & ChildrenProps): ReactElement => (
  <Heading as="h3" color={isActive ? "brand.500" : "blackAlpha.800"}>
    {children}
  </Heading>
);

interface StopWatchProps {
  readonly gameStatus: GameStatus;
}

export const StopWatch = ({
  gameStatus,
  children,
}: StopWatchProps & ChildrenProps): ReactElement => (
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

export const Score = ({ children }: ChildrenProps): ReactElement => (
  <Text mr="auto" color="white" fontWeight="semibold" fontSize="1.5rem">
    {children}
  </Text>
);
