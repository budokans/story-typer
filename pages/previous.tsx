import { useState } from "react";
import { Page } from "@/components/Page";
import { Archive } from "@/components/Archive";
import { useStories } from "@/context/stories";

const Previous: React.FC = () => {
  const [listType, setListType] = useState<"all" | "favorites">("all");
  const { stories } = useStories();

  const handleToggleValue = (nextValue: "all" | "favorites") => {
    setListType(nextValue);
  };

  const cards = stories.map(({ title, uid }) => (
    <Archive.Card key={uid}>
      <Archive.CardTitle>{title}</Archive.CardTitle>
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
