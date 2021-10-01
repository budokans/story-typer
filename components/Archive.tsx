import { FC } from "react";
import {
  Container as ChakraContainer,
  Heading,
  VStack,
} from "@chakra-ui/react";

interface Compound {
  Header: FC;
}

type ArchiveCC = FC & Compound;

export const Archive: ArchiveCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: FC = ({ children }) => {
  return (
    <ChakraContainer px={[0, 2, 6]}>
      <VStack>{children}</VStack>
    </ChakraContainer>
  );
};

Archive.Header = function ArchiveHeader({ children }) {
  return <Heading fontSize="clamp(1.25rem, 6vw, 4rem)">{children}</Heading>;
};
