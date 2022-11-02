import { useAuthContext } from "@/context/auth";
import { GameContainer } from "@/containers/game";
import {
  CenterContent,
  Spinner,
  DocHead,
  Page,
  LoginRerouter,
} from "@/components";
import { ReactElement } from "react";

const Play = (): ReactElement => {
  const { userId: userIsAuthorized, isLoading: isLoadingAuth } =
    useAuthContext();

  return isLoadingAuth ? (
    <CenterContent>
      <Spinner />
    </CenterContent>
  ) : (
    <>
      <DocHead />
      <Page.Page>
        {userIsAuthorized ? <GameContainer /> : <LoginRerouter />}
      </Page.Page>
    </>
  );
};

export default Play;
