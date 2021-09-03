import { useEffect, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { Game } from "@/components/Game";
import { useGame } from "@/hooks/useGame";

export const GameContainer: React.FC = () => {
  const {
    currentStory,
    onInitCountdown,
    countdown,
    timer,
    status,
    inputValue,
    onInputChange,
    userError,
    onResetClick,
    onSkipClick,
    wpm,
  } = useGame();

  const [viewportIsWiderThan768] = useMediaQuery("(min-width: 769px)");
  const [isLargeViewport, setIsLargeViewport] = useState(false);

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
    <Game>
      {status === "pending" ? (
        <Game.Skeleton isLargeViewport={isLargeViewport} />
      ) : (
        <>
          <Game.StoryHeader isLargeViewport={isLargeViewport}>
            {currentStory.title}
          </Game.StoryHeader>
          <Game.StoryText>{currentStory.storyText}</Game.StoryText>
          <Game.Pad>
            <Game.Input
              onInputClick={onInitCountdown}
              onInputChange={onInputChange}
              value={inputValue}
              gameStatus={status}
              error={userError}
            />
            {userError && <Game.ErrorAlert />}
            <Game.BtnSm type="restart" onClick={onResetClick} />
            <Game.BtnSm type="new" onClick={onSkipClick} />
          </Game.Pad>
          {status === "countdown" ? (
            <Game.Countdown>{CountDown[countdown]}</Game.Countdown>
          ) : (
            <Game.StopWatch gameStatus={status}>
              {timer.minutes}:
              {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
            </Game.StopWatch>
          )}
          {status === "complete" && <div>{wpm}</div>}
        </>
      )}
    </Game>
  );
};
