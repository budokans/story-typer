import { Container as ChakraContainer, VStack } from "@chakra-ui/react";

export const Archive: React.FC = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container: React.FC = ({ children }) => {
  return (
    <ChakraContainer px={[0, 2, 6]}>
      <VStack>{children}</VStack>
    </ChakraContainer>
  );
};
