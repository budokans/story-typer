import { useEffect, useState, FC } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { Game } from "@/components/Game";
import { useGame } from "@/hooks/useGame";
import { useUser } from "@/hooks/useUser";
import { useIsFavorite } from "@/hooks/useIsFavorite";

export const GameContainer: FC = () => {
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
    onNextClick,
    winGame,
    wpm,
  } = useGame();
  const storyId = currentStory && currentStory.uid;
  const { handleFavoriteClick, isFavorited } = useIsFavorite(storyId, status);
  const { data: user } = useUser();
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
      {status === "pending" || !user ? (
        <Game.Skeleton isLargeViewport={isLargeViewport} />
      ) : (
        <>
          <Game.StoryHeader isLargeViewport={isLargeViewport}>
            {currentStory.title}
          </Game.StoryHeader>
          <Game.StoryText>{currentStory.storyText}</Game.StoryText>
          <Game.Pad>
            {status === "complete" ? (
              <Game.Score>{wpm} WPM!</Game.Score>
            ) : (
              <Game.Input
                onInputClick={onInitCountdown}
                onInputChange={onInputChange}
                value={inputValue}
                gameStatus={status}
                error={userError}
              />
            )}
            {userError && <Game.ErrorAlert />}

            {status === "complete" && (
              <Game.Favorite
                onFavoriteClick={handleFavoriteClick}
                isFavorited={isFavorited}
              />
            )}
            <Game.BtnSm type="restart" onClick={winGame} />
            <Game.BtnSm
              type="new"
              onClick={status === "complete" ? onNextClick : onSkipClick}
            />
          </Game.Pad>

          {status === "idle" && <Game.Countdown>Ready</Game.Countdown>}

          {status === "countdown" && (
            <Game.Countdown active>{CountDown[countdown]}</Game.Countdown>
          )}

          {status === "inGame" && (
            <Game.StopWatch gameStatus={status}>
              {timer.minutes}:
              {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
            </Game.StopWatch>
          )}
        </>
      )}
    </Game>
  );
};
