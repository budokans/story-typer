import Link from "next/link";
import { Box, MenuItem } from "@chakra-ui/react";
import { useAuth } from "@/context/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleIcon } from "@/components/GoogleIcon";

export const LayoutContainer: React.FC = ({ children }) => {
  const { user, signOut, signInWithGoogle } = useAuth();
  const userMenuItemStateStyles = {
    _hover: { bg: "blackAlpha.600" },
    _active: { bg: "blackAlpha.300" },
    _focus: { bg: "blackAlpha.300" },
  };

  return (
    <Box position="relative" minH="100vh" pb={[9, 9, 14]} bg="gray.100">
      <Header>
        {user && (
          <>
            <Header.StatsContainer>
              <Header.StatsType>Best:</Header.StatsType>
              <Header.Stat>110</Header.Stat>
            </Header.StatsContainer>
            <Header.StatsContainer>
              <Header.StatsType>Avg:</Header.StatsType>
              <Header.Stat>105</Header.Stat>
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
      </Header>

      <Box as="main" maxW="930px" margin="0 auto" py={[4, 8]} px={[1, 4, 4, 0]}>
        {children}
      </Box>

      <Footer>
        <Footer.Text>Created by</Footer.Text>
        <Footer.NameLink>Steven Webster</Footer.NameLink>
        <Footer.GitHub />
      </Footer>
    </Box>
  );
};
