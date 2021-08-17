import { CountUp } from "use-count-up";
import { Welcome } from "@/components/Welcome";
import { LayoutContainer } from "@/containers/layout";
import { useAuth } from "@/context/auth";
import { FiftyWordStoriesLink } from "@/components/FiftyWordStoriesLink";
import { Button, Skeleton, Text } from "@chakra-ui/react";

const Index: React.FC = () => {
  const auth = useAuth();

  return (
    <LayoutContainer auth={auth}>
      <Welcome>
        <Welcome.Brand />

        <Welcome.HeadlinesWrapper>
          <Welcome.Headline>
            The speed-typing game for lovers of short stories.
          </Welcome.Headline>
          <Welcome.Headline>
            Over{" "}
            <Text
              display="inline"
              fontWeight="400"
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              <CountUp isCounting start={1843} end={2032} duration={2.75} />
            </Text>{" "}
            stories sourced from{" "}
            <FiftyWordStoriesLink hoverColor="blackAlpha.700">
              fiftywordstories.com
            </FiftyWordStoriesLink>
            .
          </Welcome.Headline>
          <Welcome.Headline>Updated daily.</Welcome.Headline>
        </Welcome.HeadlinesWrapper>

        <Skeleton isLoaded={!auth?.isLoading} h="300px">
          {!auth?.user ? (
            <Welcome.CTAWrapper>
              <Welcome.CTA onSignInClick={auth?.signInWithGoogle} />
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
            </Welcome.CTAWrapper>
          ) : (
            <Button>Play Now</Button>
          )}
        </Skeleton>
      </Welcome>
    </LayoutContainer>
  );
};

export default Index;
