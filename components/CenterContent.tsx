import { Center, useMediaQuery } from "@chakra-ui/react";
import { ReactElement } from "react";
import { ChildrenProps } from "components";
import { Styles } from "@/styles";

interface CenterContentProps {
  readonly observeLayout?: boolean;
}

export const CenterContent = ({
  observeLayout,
  children,
}: CenterContentProps & ChildrenProps): ReactElement => {
  const [mediaQuery] = useMediaQuery("(min-width: 769px)");
  const viewportIsWiderThan768 = mediaQuery!;

  const headerHeight = Styles.headerFooterHeight(
    viewportIsWiderThan768 ? "desktop" : "mobile",
    true
  );

  const footerHeight = Styles.headerFooterHeight(
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
