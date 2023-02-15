import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FavoritesContainer,
  GameContainer,
  Page,
  PrevGamesContainer,
} from "@/containers";
import { DocHead, Archive, CenterContent, Spinner } from "@/components";
import { useAuthContext } from "@/context/auth";

const Play = (): ReactElement => {
  const { authUser, authStateIsLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authUser && !authStateIsLoading) {
      router.push("./");
    }
  }, [router, authUser, authStateIsLoading]);

  if (authStateIsLoading) {
    return (
      <CenterContent>
        <Spinner />
      </CenterContent>
    );
  }

  return (
    <>
      <DocHead />
      <Page.Authenticated>
        <ContainerToggler />
      </Page.Authenticated>
    </>
  );
};

type Location = "game" | "archive";

const ContainerToggler = (): ReactElement => {
  const [location, setLocation] = useState<Location>("game");
  const router = useRouter();

  useEffect(() => {
    router.query.location === "archive"
      ? setLocation("archive")
      : setLocation("game");
  }, [router.query.location]);

  switch (location) {
    case "game":
      return <GameContainer />;
    case "archive":
      return (
        <Archive.Archive>
          <Archive.BackToGameButton />
          <Archive.Header>Previously...</Archive.Header>
          <Archive.Toggles />
          {router.query.favorites ? (
            <FavoritesContainer />
          ) : (
            <PrevGamesContainer />
          )}
        </Archive.Archive>
      );
  }
};

export default Play;
