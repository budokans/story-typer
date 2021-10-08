import { Spinner as ChakraSpinner } from "@chakra-ui/react";

export const Spinner: React.FC = () => {
  return (
    <ChakraSpinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="brand.500"
      size="xl"
    />
  );
};
