import { useEffect, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { LayoutContainer } from "@/containers/layout";
import { Game } from "@/components/Game";
import { useGame } from "@/hooks/useGame";

const Play: React.FC = () => {
  const [viewportIsWiderThan768] = useMediaQuery("(min-width: 769px)");
  const [isLargeViewport, setIsLargeViewport] = useState(false);
  const { onInitCountdown, countdown, status } = useGame();

  useEffect(() => {
    viewportIsWiderThan768
      ? setIsLargeViewport(true)
      : setIsLargeViewport(false);
  }, [viewportIsWiderThan768]);

  enum CountDown {
    "Go!",
    "Set",
    "Ready",
  }

  return (
    <LayoutContainer>
      <Game>
        {isLargeViewport && (
          <Game.StoryHeader>EDDIE D MOORE: You Have Arrived</Game.StoryHeader>
        )}

        <Game.StoryText>
          When the GPS said that I had arrived at my destination, I found myself
          parked in front of an abandoned country church on a dead end, gravel
          road. Most of the paint had long peeled away, and the graveyard beside
          it was full. I wondered who buried the last member.
        </Game.StoryText>

        <Game.Pad>
          <Game.Input onInputClick={onInitCountdown} gameStatus={status} />
          {isLargeViewport && <Game.ErrorAlert />}
          <Game.BtnSm type="restart" />
          <Game.BtnSm type="new" />
        </Game.Pad>
        {status === "countdown" ? (
          <Game.Countdown>{CountDown[countdown]}</Game.Countdown>
        ) : (
          <Game.StopWatch idle={status === "idle"} />
        )}
      </Game>
    </LayoutContainer>
  );
};

export default Play;
