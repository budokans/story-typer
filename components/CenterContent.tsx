import { Center, useMediaQuery } from "@chakra-ui/react";
import { ChildrenProps } from "interfaces";
import { ReactElement } from "react";
import { Styles } from "@/styles";

interface CenterContentProps {
  readonly observeLayout?: boolean;
}

export const CenterContent = ({
  observeLayout,
  children,
}: CenterContentProps & ChildrenProps): ReactElement => {
  const [viewportIsWiderThan768] = useMediaQuery("(min-width: 769px)");

  const headerHeight = Styles.headerFooterTotalHeight(
    viewportIsWiderThan768 ? "desktop" : "mobile",
    true
  );

  const footerHeight = Styles.headerFooterTotalHeight(
    viewportIsWiderThan768 ? "desktop" : "mobile",
    false
  );

  const mainYPadding = Styles.totalMainPaddingY(viewportIsWiderThan768);

  return (
    <Center
      minH={
        observeLayout
          ? `calc(100vh - ${headerHeight}px - ${footerHeight}px - ${mainYPadding}px)`
          : "100vh"
      }
    >
      {children}
    </Center>
  );
};
