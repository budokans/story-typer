import { ReactElement } from "react";
import { GetStaticProps } from "next";
import { Box, Text } from "@chakra-ui/react";
import { getStoriesCount } from "@/db/admin";
import { useAuthContext } from "@/context/auth";
import { Page } from "@/containers";
import {
  DocHead,
  Home,
  CountUp,
  FiftyWordStoriesLink,
  GoogleIcon,
} from "@/components";

interface IndexProps {
  readonly storiesCount: number;
}

export const getStaticProps: GetStaticProps = async () => {
  const storiesCount = await getStoriesCount();
  return {
    props: { storiesCount },
    revalidate: 86400,
  };
};

const Index = ({ storiesCount }: IndexProps): ReactElement => {
  const { signIn, signInError } = useAuthContext();

  return (
    <>
      <DocHead />
      <Page.Unauthenticated>
        <Home.Home>
          <Home.Brand />
          <Home.HeadlinesWrapper>
            <Home.Headline>
              The speed-typing game for lovers of short stories.
            </Home.Headline>
            <Home.Headline>
              Over{" "}
              <CountUp
                start={storiesCount - 150}
                end={storiesCount}
                duration={2.75}
              />{" "}
              stories sourced from{" "}
              <FiftyWordStoriesLink hoverColor="blackAlpha.700">
                fiftywordstories.com
              </FiftyWordStoriesLink>
              .
            </Home.Headline>
            <Home.Headline>Updated daily.</Home.Headline>
          </Home.HeadlinesWrapper>

          <Box pt={2} pb={4}>
            <Home.PlayButton onClick={() => signIn()}>
              <GoogleIcon />
              Continue with Google
            </Home.PlayButton>

            {signInError && (
              <Text color={"red"}>Sign in failed. Please try again.</Text>
            )}
          </Box>

          <Home.FeaturesWrapper>
            <Home.FeaturesHeading />
            <Home.Features>
              <Home.Feature>Never play the same story twice</Home.Feature>
              <Home.Feature>Review previous games and stats</Home.Feature>
              <Home.Feature>Keep tabs on your favorite stories</Home.Feature>
              <Home.Feature>Keep track of your top scores</Home.Feature>
            </Home.Features>
          </Home.FeaturesWrapper>
        </Home.Home>
      </Page.Unauthenticated>
    </>
  );
};

export default Index;
