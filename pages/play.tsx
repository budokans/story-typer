import { useAuth } from "@/context/auth";
import { Page } from "@/components/Page";
import { GameContainer } from "@/containers/game";
import { LoginRerouter } from "@/components/LoginRerouter";

const Play: React.FC = () => {
  const { userId: userIsAuthorized } = useAuth();

  return (
    <Page>{userIsAuthorized ? <GameContainer /> : <LoginRerouter />}</Page>
  );
};

export default Play;
