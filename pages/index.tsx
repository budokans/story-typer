import { Welcome } from "@/components/Welcome";
import { LayoutContainer } from "@/containers/layout";
import { useAuth } from "@/context/auth";
import { FiftyWordStoriesLink } from "@/components/FiftyWordStoriesLink";

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
            Over 2000 stories sourced from{" "}
            <FiftyWordStoriesLink>fiftywordstories.com</FiftyWordStoriesLink>.
          </Welcome.Headline>
          <Welcome.Headline>Updated daily.</Welcome.Headline>
        </Welcome.HeadlinesWrapper>

        {!auth?.user && (
          <Welcome.CTAWrapper>
            <Welcome.CTA onSignInClick={auth?.signInWithGoogle} />
            <Welcome.Benefits>
              <Welcome.Benefit>Never play the same story twice</Welcome.Benefit>
              <Welcome.Benefit>Review previous games and stats</Welcome.Benefit>
              <Welcome.Benefit>
                Keep tabs on your favorite stories
              </Welcome.Benefit>
              <Welcome.Benefit>
                View your top and average speeds
              </Welcome.Benefit>
            </Welcome.Benefits>
          </Welcome.CTAWrapper>
        )}
      </Welcome>
    </LayoutContainer>
  );
};

export default Index;
