import { useState, FC } from "react";
import { Divider, Skeleton } from "@chakra-ui/react";
import { Page } from "@/components/Page";
import { Archive } from "@/components/Archive";
import { FavoriteButton } from "@/components/FavoriteButton";

const Previous: FC = () => {
  const [listType, setListType] = useState<"all" | "favorites">("all");
  const [isLoading, setIsLoading] = useState(true);

  const handleToggleValue = (nextValue: "all" | "favorites") => {
    setListType(nextValue);
  };

  const dummyPrevGame = {
    userId: "12312312312",
    storyId: "92929292",
    storyTitle: "The Title of the Story by Vons Limmerman",
    storyHtml:
      '<p>I was a dreamer<br /> and when my heart was sleeping<br /> there was no pain<br /> but then there was a man<br /> who came to waken me<br /> from sleep.</p> <p>He whispered his words in my heart.<br /> "Wake up," he said, and I did.</p> <p>Now I feel everything;<br /> I can no longer dream.</p>',
    datePlayed: "2021-09-17T14:54:59.329Z",
    score: 100,
  };

  const tenDummyStories = Array(10).fill(dummyPrevGame);

  const cards = tenDummyStories.map((story, idx) => (
    <Skeleton
      isLoaded={!isLoading}
      key={idx}
      borderRadius={["none", "lg"]}
      boxShadow="2px 2px 4px rgba(0, 0, 0, 0.1)"
    >
      <Archive.Card>
        <Archive.CardHeader id={idx}>
          <Archive.CardTitle>{story.storyTitle}</Archive.CardTitle>
          <Archive.CardScore>{story.score}</Archive.CardScore>
          <Archive.CardDate dateString={story.datePlayed} />
          <Archive.CloseCardIcon id={idx} />
        </Archive.CardHeader>
        <Archive.CardExpandedSection id={idx}>
          <Divider mt={4} />
          <Archive.FullStory story={story.storyHtml} />
          <Divider my={4} />
          <Archive.Buttons>
            <Archive.PlayAgainButton />
            <FavoriteButton storyId={story.storyId} />
          </Archive.Buttons>
        </Archive.CardExpandedSection>
      </Archive.Card>
    </Skeleton>
  ));

  return (
    <Page>
      <Archive>
        <Archive.BackToGameButton />
        <Archive.PageTitle>Previously...</Archive.PageTitle>
        <Archive.Toggles value={listType} onSetValue={handleToggleValue} />
        {cards}
      </Archive>
    </Page>
  );
};

export default Previous;
