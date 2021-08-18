import { LayoutContainer } from "@/containers/layout";
import { useAuth } from "@/context/auth";

const Game: React.FC = () => {
  const auth = useAuth();

  return <LayoutContainer auth={auth}>Game</LayoutContainer>;
};

export default Game;
