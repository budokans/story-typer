import { Center } from "@chakra-ui/react";

export const CenterContent: React.FC<{ observeLayout?: boolean }> = ({
  observeLayout,
  children,
}) => {
  // 100vh - Header - Footer - <main> paddingY in <LayoutContainer />.
  return (
    <Center
      minH={
        observeLayout ? ["auto", "calc(100vh - 61px - 56px - 64px)"] : "100vh"
      }
    >
      {children}
    </Center>
  );
};
