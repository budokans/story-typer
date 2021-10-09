import { useEffect, useState, FC } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { Game } from "@/components/Game";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useGame } from "@/hooks/useGame";
import { useUser } from "@/hooks/useUser";
import { CenterContent } from "@/components/CenterContent";

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
    onNextClick,
    onSkipClick,
    wpm,
  } = useGame();
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
    <CenterContent observeLayout>
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
              ) : status === "outOfTime" ? (
                <Game.Score>Out of time!</Game.Score>
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
                <FavoriteButton
                  storyDetails={{
                    storyId: currentStory.uid,
                    storyTitle: currentStory.title,
                    storyHtml: currentStory.storyHtml,
                  }}
                />
              )}

              <Game.BtnSm type="restart" onClick={onResetClick} />
              <Game.BtnSm
                type="new"
                onClick={status === "complete" ? onNextClick : onSkipClick}
              />
            </Game.Pad>

            {status === "idle" && <Game.Countdown>Ready</Game.Countdown>}

            {status === "countdown" && (
              <Game.Countdown active>{CountDown[countdown]}</Game.Countdown>
            )}

            {(status === "inGame" || status === "complete") && (
              <Game.StopWatch gameStatus={status}>
                {timer.minutes}:
                {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
              </Game.StopWatch>
            )}
          </>
        )}
      </Game>
    </CenterContent>
  );
};
