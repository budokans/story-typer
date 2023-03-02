import { ReactElement, useEffect, useState } from "react";
import { function as F, option as O } from "fp-ts";
import { useRouter } from "next/router";
import {
  FavoritesContainer,
  GameContainer,
  Page,
  PrevGamesContainer,
} from "containers";
import { DocHead, Archive, CenterContent, Spinner } from "components";
import { Auth as AuthContext } from "context";

const Game = (): ReactElement => {
  const { authUser, authStateIsLoading } = AuthContext.useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authUser && !authStateIsLoading) {
      router.push("./");
    }
  }, [router, authUser, authStateIsLoading]);

  return F.pipe(
    authUser,
    O.fromNullable,
    O.match(
      () => (
        <>
          <DocHead />
          <Page.Unauthenticated>
            <CenterContent>
              <Spinner />
            </CenterContent>
          </Page.Unauthenticated>
        </>
      ),
      (authUser) => (
        <>
          <DocHead />
          <Page.Authenticated authUser={authUser}>
            <ContainerToggler />
          </Page.Authenticated>
        </>
      )
    )
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

export default Game;
