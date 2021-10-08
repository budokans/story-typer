import { useState, useEffect, FC } from "react";
import { useRouter } from "next/router";
import { Page } from "@/components/Page";
import { Archive } from "@/components/Archive";
import { PrevGamesContainer } from "@/containers/prevGames";
import { FavoritesContainer } from "@/containers/favorites";

const Previous: FC = () => {
  const [listType, setListType] = useState<"all" | "favorites">("all");
  const { query } = useRouter();

  useEffect(() => {
    query.favorites ? setListType("favorites") : setListType("all");
  }, [query.favorites]);

  const handleToggleValue = (nextValue: "all" | "favorites") => {
    setListType(nextValue);
  };

  return (
    <Page>
      <Archive>
        <Archive.BackToGameButton />
        <Archive.PageTitle>Previously...</Archive.PageTitle>
        <Archive.Toggles value={listType} onSetValue={handleToggleValue} />
        {listType === "all" ? <PrevGamesContainer /> : <FavoritesContainer />}
      </Archive>
    </Page>
  );
};

export default Previous;
