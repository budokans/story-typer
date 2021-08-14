import Link from "next/link";
import { MenuItem } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/auth";

const Index: React.FC = () => {
  const auth = useAuth();

  const userMenuItemStateStyles = {
    _hover: { bg: "blackAlpha.600" },
    _active: { bg: "blackAlpha.300" },
    _focus: { bg: "blackAlpha.300" },
  };

  return (
    <>
      <Header>
        {auth?.user && (
          <>
            <Header.StatsContainer>
              <Header.StatsHeader>Best:</Header.StatsHeader>
              <Header.Stat>110</Header.Stat>
            </Header.StatsContainer>
            <Header.StatsContainer>
              <Header.StatsHeader>Avg:</Header.StatsHeader>
              <Header.Stat>105</Header.Stat>
            </Header.StatsContainer>
            <Header.Archive />
          </>
        )}
        <Header.UserMenu user={auth && auth.user}>
          {auth?.user ? (
            <>
              <Link href="#" passHref>
                <MenuItem sx={userMenuItemStateStyles}>My Account</MenuItem>
              </Link>
              <MenuItem
                sx={userMenuItemStateStyles}
                onClick={() => auth.signOut()}
              >
                Sign out
              </MenuItem>
            </>
          ) : (
            <MenuItem
              sx={userMenuItemStateStyles}
              onClick={() => auth?.signInWithGoogle()}
            >
              Sign in
            </MenuItem>
          )}
        </Header.UserMenu>
      </Header>
    </>
  );
};

export default Index;
