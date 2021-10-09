import { useState, useEffect, FC } from "react";
import { useRouter } from "next/router";
import { DocHead } from "@/components/DocHead";
import { useAuth } from "@/context/auth";
import { Page } from "@/components/Page";
import { Archive } from "@/components/Archive";
import { PrevGamesContainer } from "@/containers/prevGames";
import { FavoritesContainer } from "@/containers/favorites";
import { LoginRerouter } from "@/components/LoginRerouter";
import { Spinner } from "@/components/Spinner";
import { CenterContent } from "@/components/CenterContent";

const Previous: FC = () => {
  const { userId: userIsAuthorized, isLoading: isLoadingAuth } = useAuth();
  const [listType, setListType] = useState<"all" | "favorites">("all");
  const { query } = useRouter();

  useEffect(() => {
    query.favorites ? setListType("favorites") : setListType("all");
  }, [query.favorites]);

  const handleToggleValue = (nextValue: "all" | "favorites") => {
    setListType(nextValue);
  };

  return isLoadingAuth ? (
    <CenterContent>
      <Spinner />
    </CenterContent>
  ) : (
    <>
      <DocHead />
      <Page>
        {userIsAuthorized ? (
          <Archive>
            <Archive.BackToGameButton />
            <Archive.PageTitle>Previously...</Archive.PageTitle>
            <Archive.Toggles value={listType} onSetValue={handleToggleValue} />
            {listType === "all" ? (
              <PrevGamesContainer />
            ) : (
              <FavoritesContainer />
            )}
          </Archive>
        ) : (
          <LoginRerouter />
        )}
      </Page>
    </>
  );
};

export default Previous;
