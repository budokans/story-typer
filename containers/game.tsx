import { ReactElement } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { Game, FavoriteButton, CenterContent } from "components";
import { useGame } from "hooks";

export const GameContainer = (): ReactElement => {
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
  const [mediaQuery] = useMediaQuery("(min-width: 769px)");
  const viewportIsWiderThan768 = mediaQuery!;

  enum CountDown {
    "Go!",
    "Set",
    "Ready",
  }

  return (
    <CenterContent observeLayout>
      <Game.Game>
        {status === "pending" ? (
          <Game.Skeleton isLargeViewport={viewportIsWiderThan768} />
        ) : !currentStory ? (
          <p>Error: Invalid current story.</p>
        ) : (
          <>
            <Game.StoryHeader isLargeViewport={viewportIsWiderThan768}>
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
                    storyId: currentStory.id,
                    storyTitle: currentStory.title,
                    storyHtml: currentStory.storyHtml,
                  }}
                />
              )}

              <Game.NewGameButton type="restart" onClick={onResetClick} />
              <Game.NewGameButton
                type="new"
                onClick={status === "complete" ? onNextClick : onSkipClick}
              />
            </Game.Pad>

            {status === "idle" && (
              <Game.Countdown isActive={false}>Ready</Game.Countdown>
            )}

            {status === "countdown" && (
              <Game.Countdown isActive>{CountDown[countdown]}</Game.Countdown>
            )}

            {(status === "inGame" || status === "complete") && (
              <Game.StopWatch gameStatus={status}>
                {timer.minutes}:
                {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
              </Game.StopWatch>
            )}
          </>
        )}
      </Game.Game>
    </CenterContent>
  );
};
