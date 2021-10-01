import { useState } from "react";
import { Page } from "@/components/Page";
import { Archive } from "@/components/Archive";

const Previous: React.FC = () => {
  const [listType, setListType] = useState<"all" | "favorites">("all");

  const handleToggleValue = (nextValue: "all" | "favorites") => {
    setListType(nextValue);
  };

  return (
    <Page>
      <Archive>
        <Archive.Header>Previously...</Archive.Header>
        <Archive.Toggles value={listType} onSetValue={handleToggleValue} />
      </Archive>
    </Page>
  );
};

export default Previous;
