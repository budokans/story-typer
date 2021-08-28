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
  } = useGame();

  enum CountDown {
    "Go!",
    "Set",
    "Ready",
  }

  return (
    <Game>
      <Game.StoryHeader>
        {status !== "loading" ? currentStory.title : ""}
      </Game.StoryHeader>

      <Game.StoryText>
        {status !== "loading" ? currentStory.storyText : ""}
      </Game.StoryText>

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
        <Game.BtnSm type="new" onClick={onResetClick} />
      </Game.Pad>
      {status === "countdown" ? (
        <Game.Countdown>{CountDown[countdown]}</Game.Countdown>
      ) : (
        <Game.StopWatch gameStatus={status}>
          {timer.minutes}:
          {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
        </Game.StopWatch>
      )}
    </Game>
  );
};
