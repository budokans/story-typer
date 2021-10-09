import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { getStoriesCount } from "@/lib/db-admin";
import { useAuth } from "@/context/auth";
import { DocHead } from "@/components/DocHead";
import { Page } from "@/components/Page";
import { Home } from "@/components/Home";
import { FiftyWordStoriesLink } from "@/components/FiftyWordStoriesLink";
import { CountUp } from "@/components/CountUp";
import { GoogleIcon } from "@/components/GoogleIcon";

export const getStaticProps: GetStaticProps = async () => {
  const storiesCount = await getStoriesCount();
  return {
    props: { storiesCount },
    revalidate: 86400,
  };
};

const Index: React.FC<{ storiesCount: number }> = ({ storiesCount }) => {
  const { userId, signInWithGoogle } = useAuth();
  const userIsLoggedIn = !!userId;
  const router = useRouter();

  return (
    <>
      <DocHead />
      <Page>
        <Home>
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
              <Home.PlayBtn onClick={() => signInWithGoogle()}>
                <GoogleIcon />
                Continue with Google
              </Home.PlayBtn>
            ) : (
              <Home.PlayBtn onClick={() => router.push("/play")}>
                Play Now
              </Home.PlayBtn>
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
        </Home>
      </Page>
    </>
  );
};

export default Index;
