import { ReactElement } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { getStoriesCount } from "@/lib/db-admin";
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
  const { userId, signInWithGoogle } = useAuthContext();
  const userIsLoggedIn = !!userId;
  const router = useRouter();

  return (
    <>
      <DocHead />
      <Page>
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
            {!userIsLoggedIn ? (
              <Home.PlayButton onClick={() => signInWithGoogle()}>
                <GoogleIcon />
                Continue with Google
              </Home.PlayButton>
            ) : (
              <Home.PlayButton onClick={() => router.push("/play")}>
                Play Now
              </Home.PlayButton>
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
      </Page>
    </>
  );
};

export default Index;
