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
    <CenterContent>
      <Spinner />
    </CenterContent>
  ) : (
    <>
      <DocHead />
      <Page>
        <CenterContent>
          {userIsAuthorized ? <GameContainer /> : <LoginRerouter />}
        </CenterContent>
      </Page>
    </>
  );
};

export default Play;
