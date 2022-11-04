import Link from "next/link";
import { Box, MenuItem } from "@chakra-ui/react";
import { useAuthContext } from "@/context/auth";
import { useUser } from "@/hooks";
import { Header, Footer, GoogleIcon } from "@/components";
import { getUserAverageScoresDisplay } from "@/lib/manageUser";
import { ReactElement } from "react";
import { ChildrenProps } from "interfaces";
import { Styles } from "@/styles";

export const Page = ({ children }: ChildrenProps): ReactElement => {
  const { signOut, signInWithGoogle } = useAuthContext();
  const { data: user } = useUser();

  return (
    <Box position="relative" minH="100vh" pb={[9, 9, 14]} bg="gray.100">
      <Header.Header>
        {user && (
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
          </>
        )}
        <Header.UserMenu>
          {user ? (
            <>
              <Link href="#" passHref>
                <MenuItem sx={Styles.userMenuItemStateStyles}>
                  My Account
                </MenuItem>
              </Link>
              <MenuItem
                sx={Styles.userMenuItemStateStyles}
                onClick={() => signOut()}
              >
                Sign out
              </MenuItem>
            </>
          ) : (
            <MenuItem
              sx={Styles.userMenuItemStateStyles}
              onClick={() => signInWithGoogle()}
            >
              <GoogleIcon /> Sign in with Google
            </MenuItem>
          )}
        </Header.UserMenu>
      </Header.Header>

      <Box
        as="main"
        maxW="930px"
        margin="0 auto"
        py={[
          `${Styles.mainPaddingYMobile}px`,
          `${Styles.mainPaddingYDesktop}px`,
        ]}
        px={[1, 4, 4, 0]}
      >
        {children}
      </Box>

      <Footer.Footer>
        <Footer.Text>Created by</Footer.Text>
        <Footer.NameLink>Steven Webster</Footer.NameLink>
        <Footer.GitHubLink />
      </Footer.Footer>
    </Box>
  );
};
