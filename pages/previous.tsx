import { useState } from "react";
import { Page } from "@/components/Page";
import { Archive } from "@/components/Archive";

const Previous: React.FC = () => {
  const [listType, setListType] = useState<"all" | "favorites">("all");

  const handleToggleValue = (nextValue: "all" | "favorites") => {
    setListType(nextValue);
  };

  const dummyPrevGame = {
    userId: "12312312312",
    storyId: "92929292",
    storyTitle: "The Title of the Story by Vons Limmerman",
    storyText:
      "When the GPS said that I had arrived at my destination, I found myself parked in front of an abandoned country church on a dead end, gravel road. Most of the paint had long peeled away, and the graveyard beside it was full. I wondered who buried the last member.",
    datePlayed: "2021-09-17T14:54:59.329Z",
    score: 100,
  };

  const tenDummyStories = Array(10).fill(dummyPrevGame);

  const cards = tenDummyStories.map((story, idx) => (
    <Archive.Card key={idx}>
      <Archive.CardTitle>{story.storyTitle}</Archive.CardTitle>
      <Archive.CardScore>{story.score}</Archive.CardScore>
      <Archive.CardDate>{story.datePlayed}</Archive.CardDate>
    </Archive.Card>
  ));

  return (
    <Page>
      <Archive>
        <Archive.Header>Previously...</Archive.Header>
        <Archive.Toggles value={listType} onSetValue={handleToggleValue} />

        {cards}
      </Archive>
    </Page>
  );
};

export default Previous;
