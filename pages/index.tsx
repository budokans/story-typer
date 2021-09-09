import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Skeleton } from "@chakra-ui/react";
import { getStoriesCount } from "@/lib/db-admin";
import { useAuth } from "@/context/auth";
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
  const { user, isLoading, signInWithGoogle } = useAuth();
  const router = useRouter();

  return (
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

        <Skeleton isLoaded={!isLoading}>
          <Home.CTAWrapper>
            {!user ? (
              <>
                <Home.CTA />
                <Home.Benefits>
                  <Home.Benefit>Never play the same story twice</Home.Benefit>
                  <Home.Benefit>Review previous games and stats</Home.Benefit>
                  <Home.Benefit>
                    Keep tabs on your favorite stories
                  </Home.Benefit>
                  <Home.Benefit>View your top and average speeds</Home.Benefit>
                </Home.Benefits>

                <Home.PlayBtn onClick={() => signInWithGoogle()}>
                  <GoogleIcon />
                  Continue with Google
                </Home.PlayBtn>
              </>
            ) : (
              <Home.PlayBtn onClick={() => router.push("/play")}>
                Play Now
              </Home.PlayBtn>
            )}
          </Home.CTAWrapper>
        </Skeleton>
      </Home>
    </Page>
  );
};

export default Index;
