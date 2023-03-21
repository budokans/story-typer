import { ReactElement } from "react";
import { function as F } from "fp-ts";
import { useMediaQuery } from "@chakra-ui/react";
import { RiRestartFill, RiSkipForwardFill } from "react-icons/ri";
import { Game, FavoriteButton, CenterContent, ChildrenProps } from "components";
import { Story as StoryAPI } from "api-client";
import { useGame, Timer } from "hooks";
import { User as UserContext } from "context";

export const GameContainer = (): ReactElement => (
  <GameWrapper>
    <GameInternal />
  </GameWrapper>
);

export const GameWrapper = ({ children }: ChildrenProps): ReactElement => (
  <CenterContent observeLayout>
    <Game.Game>{children}</Game.Game>
  </CenterContent>
);

const GameInternal = (): ReactElement => {
  const game = useGame();
  const user = UserContext.useUserContext();

  enum CountDown {
    "Go!",
    "Set",
    "Ready",
  }

  switch (game._tag) {
    case "pre-game":
      return (
        <WithStoryContent story={game.currentStory}>
          <Game.Pad>
            <Game.Input
              placeholder="Click here to begin"
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onInitCountdown,
                  (unsafePerformIO) => unsafePerformIO()
                )
              }
              isReadOnly
            />
            <Game.NextGameButton
              aria-label="Restart game"
              disabled
              icon={<RiRestartFill />}
              bg="gold"
            />
            <Game.NextGameButton
              aria-label="Skip game"
              icon={<RiSkipForwardFill />}
              bg="lime"
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onSkipClick({ currentStory: game.currentStory, user }),
                  (unsafeRunRask) => unsafeRunRask()
                )
              }
            />
          </Game.Pad>
          <Game.Countdown isActive={false}>
            {CountDown[game.countdown]}
          </Game.Countdown>
        </WithStoryContent>
      );
    case "countdown":
      return (
        <WithStoryContent story={game.currentStory}>
          <Game.Pad>
            <Game.Input isReadOnly isDisabled />
            <Game.NextGameButton
              aria-label="Restart game"
              icon={<RiRestartFill />}
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onResetClick,
                  (unsafePerformIO) => unsafePerformIO()
                )
              }
              bg="gold"
            />
            <Game.NextGameButton
              aria-label="Skip game"
              disabled
              icon={<RiSkipForwardFill />}
              bg="lime"
            />
          </Game.Pad>
          <Game.Countdown isActive>{CountDown[game.countdown]}</Game.Countdown>
        </WithStoryContent>
      );
    case "in-game":
      return (
        <WithStoryContent story={game.currentStory}>
          <Game.Pad>
            <Game.Input
              isFocused
              value={game.userInput}
              bg={game.userErrorIsPresent ? "red.300" : "white"}
              onChange={(event) =>
                F.pipe(
                  // Force new line
                  event,
                  game.onInputChange,
                  (unsafePerformIO) => unsafePerformIO()
                )
              }
            />
            {game.userErrorIsPresent && <Game.ErrorAlert />}
            <Game.NextGameButton
              aria-label="Restart game"
              icon={<RiRestartFill />}
              bg="gold"
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onResetClick,
                  (unsafePerformIO) => unsafePerformIO()
                )
              }
            />
            <Game.NextGameButton
              aria-label="Skip game"
              disabled
              icon={<RiSkipForwardFill />}
              bg="lime"
            />
          </Game.Pad>
          <Game.StopWatch isActive>
            {Timer.timerDisplay(game.timer)}
          </Game.StopWatch>
        </WithStoryContent>
      );
    case "win":
      return (
        <WithStoryContent story={game.currentStory}>
          <Game.Pad>
            <Game.Score>{game.wpm} WPM!</Game.Score>
            <FavoriteButton
              storyDetails={{
                storyId: game.currentStory.id,
                storyTitle: game.currentStory.title,
                storyHtml: game.currentStory.storyHtml,
              }}
            />
            <Game.NextGameButton
              aria-label="Restart game"
              icon={<RiRestartFill />}
              bg="gold"
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onResetClick,
                  (unsafePerformIO) => unsafePerformIO()
                )
              }
            />
            <Game.NextGameButton
              aria-label="New game"
              icon={<RiSkipForwardFill />}
              bg="lime"
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onNextClick,
                  (unsafePerformIO) => unsafePerformIO()
                )
              }
            />
          </Game.Pad>
          <Game.StopWatch>{Timer.timerDisplay(game.timer)}</Game.StopWatch>
        </WithStoryContent>
      );
    case "lose":
      return (
        <WithStoryContent story={game.currentStory}>
          <Game.Pad>
            <Game.Score>Out of time!</Game.Score>
            <Game.NextGameButton
              aria-label="Restart game"
              icon={<RiRestartFill />}
              bg="gold"
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onResetClick,
                  (unsafePerformIO) => unsafePerformIO()
                )
              }
            />
            <Game.NextGameButton
              aria-label="Skip game"
              icon={<RiSkipForwardFill />}
              bg="lime"
              onClick={() =>
                F.pipe(
                  // Force new line
                  game.onSkipClick({ currentStory: game.currentStory, user }),
                  (unsafeRunRask) => unsafeRunRask()
                )
              }
            />
          </Game.Pad>
        </WithStoryContent>
      );
  }
};

const WithStoryContent = ({
  story,
  children,
}: {
  readonly story: StoryAPI.Response;
} & ChildrenProps): ReactElement => {
  const [mediaQuery] = useMediaQuery("(min-width: 769px)");
  const viewportIsWiderThan768 = mediaQuery!;

  return (
    <>
      <Game.StoryHeader isLargeViewport={viewportIsWiderThan768}>
        {story.title}
      </Game.StoryHeader>
      <Game.StoryText>{story.storyText}</Game.StoryText>
      {children}
    </>
  );
};
