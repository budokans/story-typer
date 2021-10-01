import {
  Container as ChakraContainer,
  Heading,
  VStack,
} from "@chakra-ui/react";

interface Compound {
  Header: React.FC;
}

type ArchiveCC = React.FC & Compound;

export const Archive: ArchiveCC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: React.FC = ({ children }) => {
  return (
    <ChakraContainer px={[0, 2, 6]}>
      <VStack>{children}</VStack>
    </ChakraContainer>
  );
};

Archive.Header = function ArchiveHeader({ children }) {
  return <Heading fontSize="clamp(1.25rem, 6vw, 4rem)">{children}</Heading>;
};
