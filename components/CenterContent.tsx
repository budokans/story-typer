import { Center } from "@chakra-ui/react";

export const CenterContent: React.FC<{ centerOnMobile?: boolean }> = ({
  centerOnMobile,
  children,
}) => {
  // 100vh - Header - Footer - <main> paddingY in <LayoutContainer />.
  return (
    <Center
      minH={
        centerOnMobile
          ? ["100vh", "calc(100vh - 61px - 56px - 64px)"]
          : ["auto", "calc(100vh - 61px - 56px - 64px)"]
      }
    >
      {children}
    </Center>
  );
};
