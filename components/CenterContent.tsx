import { Center } from "@chakra-ui/react";
import { ChildrenProps } from "interfaces";
import { ReactElement } from "react";

interface CenterContentProps {
  readonly observeLayout?: boolean;
}

export const CenterContent = ({
  observeLayout,
  children,
}: CenterContentProps & ChildrenProps): ReactElement => {
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
