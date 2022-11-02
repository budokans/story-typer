import { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/auth";
import {
  CenterContent,
  Spinner,
  DocHead,
  Archive,
  LoginRerouter,
} from "@/components";
import { Page, FavoritesContainer, PrevGamesContainer } from "@/containers";

const Previous = (): ReactElement => {
  const { userId: userIsAuthorized, isLoading: isLoadingAuth } =
    useAuthContext();
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
          <Archive.Archive>
            <Archive.BackToGameButton />
            <Archive.Header>Previously...</Archive.Header>
            <Archive.Toggles
              filter={listType}
              onSetFilter={handleToggleValue}
            />
            {listType === "all" ? (
              <PrevGamesContainer />
            ) : (
              <FavoritesContainer />
            )}
          </Archive.Archive>
        ) : (
          <LoginRerouter />
        )}
      </Page>
    </>
  );
};

export default Previous;
