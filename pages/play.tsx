import { ReactElement } from "react";
import { useAuthContext } from "@/context/auth";
import { Page, GameContainer } from "@/containers";
import { CenterContent, Spinner, DocHead, LoginRerouter } from "@/components";

const Play = (): ReactElement => {
  const { authUser, authStateIsLoading } = useAuthContext();

  return authStateIsLoading ? (
    <CenterContent>
      <Spinner />
    </CenterContent>
  ) : (
    <>
      <DocHead />
      <Page>{authUser ? <GameContainer /> : <LoginRerouter />}</Page>
    </>
  );
};

export default Play;
