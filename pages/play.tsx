import { useAuth } from "@/context/auth";
import { DocHead } from "@/components/DocHead";
import { Page } from "@/components/Page";
import { GameContainer } from "@/containers/game";
import { LoginRerouter } from "@/components/LoginRerouter";

const Play: React.FC = () => {
  const { userId: userIsAuthorized } = useAuth();

  return (
    <>
      <DocHead />
      <Page>{userIsAuthorized ? <GameContainer /> : <LoginRerouter />}</Page>
    </>
  );
};

export default Play;
