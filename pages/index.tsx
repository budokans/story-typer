import { GetStaticProps } from "next";
import { Skeleton } from "@chakra-ui/react";
import { getStoriesCount } from "@/lib/db-admin";
import { useAuth } from "@/context/auth";
import { LayoutContainer } from "@/containers/layout";
import { Welcome } from "@/components/Welcome";
import { FiftyWordStoriesLink } from "@/components/FiftyWordStoriesLink";
import { CountUp } from "@/components/CountUp";

export const getStaticProps: GetStaticProps = async () => {
  const storiesCount = await getStoriesCount();
  return {
    props: { storiesCount },
    revalidate: 86400,
  };
};

const Index: React.FC<{ storiesCount: number }> = ({ storiesCount }) => {
  const { user, isLoading } = useAuth();

  return (
    <LayoutContainer>
      <Welcome>
        <Welcome.Brand />

        <Welcome.HeadlinesWrapper>
          <Welcome.Headline>
            The speed-typing game for lovers of short stories.
          </Welcome.Headline>
          <Welcome.Headline>
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
          </Welcome.Headline>
          <Welcome.Headline>Updated daily.</Welcome.Headline>
        </Welcome.HeadlinesWrapper>

        <Skeleton isLoaded={!isLoading}>
          <Welcome.CTAWrapper>
            {!user ? (
              <>
                <Welcome.CTA />
                <Welcome.Benefits>
                  <Welcome.Benefit>
                    Never play the same story twice
                  </Welcome.Benefit>
                  <Welcome.Benefit>
                    Review previous games and stats
                  </Welcome.Benefit>
                  <Welcome.Benefit>
                    Keep tabs on your favorite stories
                  </Welcome.Benefit>
                  <Welcome.Benefit>
                    View your top and average speeds
                  </Welcome.Benefit>
                </Welcome.Benefits>

                <Welcome.SignInBtn />
                <Welcome.PlayBtn>Play Now</Welcome.PlayBtn>
              </>
            ) : (
              <Welcome.PlayBtn>Play Now</Welcome.PlayBtn>
            )}
          </Welcome.CTAWrapper>
        </Skeleton>
      </Welcome>
    </LayoutContainer>
  );
};

export default Index;
