import Link from "next/link";
import { MenuItem } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/auth";

const Index: React.FC = () => {
  const auth = useAuth();

  return auth ? (
    <>
      <Header>
        <Header.UserMenu user={auth.user}>
          {auth.user ? (
            <>
              <Link href="#" passHref>
                <MenuItem>My Account</MenuItem>
              </Link>
              <MenuItem onClick={() => auth.signOut()}>Sign out</MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => auth.signInWithGoogle()}>Sign in</MenuItem>
          )}
        </Header.UserMenu>
      </Header>
    </>
  ) : null;
};

export default Index;
