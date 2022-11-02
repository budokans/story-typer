import Link from "next/link";
import { Box, MenuItem } from "@chakra-ui/react";
import { useAuthContext } from "@/context/auth";
import { useUser } from "@/hooks/useUser";
import { Header, Footer, GoogleIcon } from "@/components";
import { getUserAverageScoresDisplay } from "@/lib/manageUser";
import { ReactElement } from "react";
import { ChildrenProps } from "interfaces";

export const Page = ({ children }: ChildrenProps): ReactElement => {
  const { signOut, signInWithGoogle } = useAuthContext();
  const { data: user } = useUser();
  const userMenuItemStateStyles = {
    _hover: { bg: "blackAlpha.600" },
    _active: { bg: "blackAlpha.300" },
    _focus: { bg: "blackAlpha.300" },
  };

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
                <MenuItem sx={userMenuItemStateStyles}>My Account</MenuItem>
              </Link>
              <MenuItem sx={userMenuItemStateStyles} onClick={() => signOut()}>
                Sign out
              </MenuItem>
            </>
          ) : (
            <MenuItem
              sx={userMenuItemStateStyles}
              onClick={() => signInWithGoogle()}
            >
              <GoogleIcon /> Sign in with Google
            </MenuItem>
          )}
        </Header.UserMenu>
      </Header.Header>

      <Box as="main" maxW="930px" margin="0 auto" py={[4, 8]} px={[1, 4, 4, 0]}>
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
