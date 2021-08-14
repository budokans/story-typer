import { Box, Flex, Text } from "@chakra-ui/react";

interface Compound {
  Text: React.FC;
  Name: React.FC;
}

type FooterCC = React.FC & Compound;

export const Footer: FooterCC = ({ children }) => {
  return (
    <Container>
      <Inner>{children}</Inner>
    </Container>
  );
};

const Container: React.FC = ({ children }) => {
  return (
    <Box
      as="footer"
      bg="blackAlpha.800"
      w="full"
      position="absolute"
      bottom={0}
    >
      {children}
    </Box>
  );
};

const Inner: React.FC = ({ children }) => {
  return (
    <Flex
      h={[9, 9, 14]}
      maxW="930px"
      margin="0 auto"
      align="center"
      justify={["center", "center", "flex-end"]}
    >
      {children}
    </Flex>
  );
};

Footer.Text = function FooterText({ children }) {
  return (
    <Text color="white" fontWeight="light" fontSize="clamp(0.75rem, 2vw, 1rem)">
      {children}
    </Text>
  );
};

Footer.Name = function FooterName({ children }) {
  return (
    <Text color="white" ml={1} fontSize="clamp(0.75rem, 2vw, 1rem)">
      {children}
    </Text>
  );
};
