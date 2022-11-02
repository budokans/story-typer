import { ReactElement } from "react";
import { useAuthContext } from "@/context/auth";
import { Page, GameContainer } from "@/containers";
import { CenterContent, Spinner, DocHead, LoginRerouter } from "@/components";

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
      <Page>{userIsAuthorized ? <GameContainer /> : <LoginRerouter />}</Page>
    </>
  );
};

export default Play;
