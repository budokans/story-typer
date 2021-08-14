import Link from "next/link";
import { Box, MenuItem } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/auth";
import { Footer } from "@/components/Footer";

const Index: React.FC = () => {
  const auth = useAuth();

  const userMenuItemStateStyles = {
    _hover: { bg: "blackAlpha.600" },
    _active: { bg: "blackAlpha.300" },
    _focus: { bg: "blackAlpha.300" },
  };

  return (
    <Box position="relative" minH="100vh" pb={[9, 9, 14]}>
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
            <Header.Favorites />
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
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
        laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
        cum, delectus illo eius necessitatibus vitae quasi ad assumenda dolorem
        laudantium? Sequi, consectetur esse?
      </p>
      <Footer>
        <Footer.Text>Created by</Footer.Text>
        <Footer.Name>Steven Webster</Footer.Name>
      </Footer>
    </Box>
  );
};

export default Index;
