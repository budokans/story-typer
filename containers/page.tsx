import Link from "next/link";
import { Box, MenuItem } from "@chakra-ui/react";
import { ReactElement } from "react";
import { getUserAverageScoresDisplay } from "lib/manageUser";
import { ChildrenProps, Header, Footer } from "components";
import { Styles } from "styles";
import { User as UserContext, Stories as StoriesContext } from "context";
import { useSignOut } from "hooks";

export const Unauthenticated = ({ children }: ChildrenProps): ReactElement => (
  <Main>
    <Header.HeaderBorderOnly />
    <ContentWrapper>{children}</ContentWrapper>
    <FooterContainer />
  </Main>
);

export const Authenticated = ({ children }: ChildrenProps): ReactElement => (
  <UserContext.UserLoader>
    <StoriesContext.StoriesLoader>
      <Main>
        <Header.Header>
          <AuthenticatedHeaderContent />
        </Header.Header>

        <ContentWrapper>{children}</ContentWrapper>

        <FooterContainer />
      </Main>
    </StoriesContext.StoriesLoader>
  </UserContext.UserLoader>
);

const AuthenticatedHeaderContent = (): ReactElement => {
  const user = UserContext.useUserContext();
  const { signOut } = useSignOut();

  return (
    <>
      <Header.StatsContainer>
        <Header.StatsType>Best:</Header.StatsType>
        <Header.Stat>{user.personalBest ?? "TBA"}</Header.Stat>
      </Header.StatsContainer>
      <Header.StatsContainer>
        <Header.StatsType>Avg:</Header.StatsType>
        <Header.Stat>
          {getUserAverageScoresDisplay(user.lastTenScores)}
        </Header.Stat>
      </Header.StatsContainer>
      <Header.Archive />
      <Header.Favorites />
      <Header.UserMenu photoURL={user.photoURL}>
        <>
          <Link href="#" passHref>
            <MenuItem sx={Styles.userMenuItemStateStyles}>My Account</MenuItem>
          </Link>
          <MenuItem sx={Styles.userMenuItemStateStyles} onClick={signOut}>
            Sign out
          </MenuItem>
        </>
      </Header.UserMenu>
    </>
  );
};

const Main = ({ children }: ChildrenProps): ReactElement => (
  <Box position="relative" minH="100vh" pb={[9, 9, 14]} bg="gray.100">
    {children}
  </Box>
);

const ContentWrapper = ({ children }: ChildrenProps): ReactElement => (
  <Box
    as="main"
    maxW="930px"
    margin="0 auto"
    py={[`${Styles.mainPaddingYMobile}px`, `${Styles.mainPaddingYDesktop}px`]}
    px={[1, 4, 4, 0]}
  >
    {children}
  </Box>
);

const FooterContainer = (): ReactElement => (
  <Footer.Footer>
    <Footer.Text>Created by</Footer.Text>
    <Footer.NameLink>Steven Webster</Footer.NameLink>
    <Footer.GitHubLink />
  </Footer.Footer>
);
