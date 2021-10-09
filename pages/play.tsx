import { useAuth } from "@/context/auth";
import { DocHead } from "@/components/DocHead";
import { Page } from "@/components/Page";
import { GameContainer } from "@/containers/game";
import { LoginRerouter } from "@/components/LoginRerouter";
import { Spinner } from "@/components/Spinner";
import { CenterContent } from "@/components/CenterContent";

const Play: React.FC = () => {
  const { userId: userIsAuthorized, isLoading: isLoadingAuth } = useAuth();

  return isLoadingAuth ? (
    <CenterContent centerOnMobile>
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
