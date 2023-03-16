import { useEffect, useRef, ReactElement } from "react";
import {
  Container as ChakraContainer,
  Flex,
  Heading,
  IconButton,
  IconButtonProps,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  Skeleton as ChakraSkeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { ChildrenProps } from "components";

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
  readonly isFocused?: boolean;
  readonly value?: string;
}

export const Input = ({
  isFocused,
  value,
  ...props
}: InputProps & ChakraInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFocused) inputRef?.current?.focus();
  }, [isFocused]);

  return (
    <ChakraInput
      w="clamp(12rem, 50vw, 20rem)"
      mr="auto"
      value={value ?? ""}
      ref={inputRef}
      autoCapitalize="off"
      autoComplete="off"
      onPaste={(e) => e.preventDefault()}
      bg="white"
      {...props}
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

export const NextGameButton = (props: IconButtonProps): ReactElement => (
  <IconButton
    isRound
    cursor="pointer"
    ml={3}
    fontSize="1.75rem"
    color="blackAlpha.800"
    {...props}
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
  readonly isActive?: boolean;
}

export const StopWatch = ({
  isActive,
  children,
}: StopWatchProps & ChildrenProps): ReactElement => (
  <Heading as="h4" color={isActive ? "blackAlpha.800" : "gray.500"}>
    {children}
  </Heading>
);

export const Score = ({ children }: ChildrenProps): ReactElement => (
  <Text mr="auto" color="white" fontWeight="semibold" fontSize="1.5rem">
    {children}
  </Text>
);
