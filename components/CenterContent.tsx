import { Center } from "@chakra-ui/react";

export const CenterContent: React.FC = ({ children }) => {
  // 100vh - Header - Footer - <main> paddingY in <LayoutContainer />.
  return (
    <Center minH={["auto", "calc(100vh - 61px - 56px - 64px)"]}>
      {children}
    </Center>
  );
};
