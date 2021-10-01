import { FC } from "react";
import {
  Container as ChakraContainer,
  Heading,
  VStack,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

interface Compound {
  Header: FC;
  Toggles: FC<{
    value: "all" | "favorites";
    onSetValue: (nextValue: "all" | "favorites") => void;
  }>;
}

type ArchiveCC = FC & Compound;

export const Archive: ArchiveCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: FC = ({ children }) => {
  return (
    <ChakraContainer px={[2, 2, 6]}>
      <VStack spacing={4}>{children}</VStack>
    </ChakraContainer>
  );
};

Archive.Header = function ArchiveHeader({ children }) {
  return <Heading fontSize="clamp(1.5rem, 6vw, 4rem)">{children}</Heading>;
};

Archive.Toggles = function ArchiveToggles({ value, onSetValue }) {
  return (
    <RadioGroup onChange={onSetValue} value={value} alignSelf="flex-start">
      <Stack direction="row">
        <Radio value="all">All</Radio>
        <Radio value="favorites">Favorites</Radio>
      </Stack>
    </RadioGroup>
  );
};
