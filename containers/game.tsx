import { useGame } from "@/hooks/useGame";
import { Game } from "@/components/Game";

export const GameContainer: React.FC = () => {
  const {
    onInitCountdown,
    countdown,
    status,
    inputValue,
    onInputChange,
    userError,
  } = useGame();

  enum CountDown {
    "Go!",
    "Set",
    "Ready",
  }

  return (
    <Game>
      <Game.StoryHeader>EDDIE D MOORE: You Have Arrived</Game.StoryHeader>

      <Game.StoryText>
        When the GPS said that I had arrived at my destination, I found myself
        parked in front of an abandoned country church on a dead end, gravel
        road. Most of the paint had long peeled away, and the graveyard beside
        it was full. I wondered who buried the last member.
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
        <Game.BtnSm type="restart" />
        <Game.BtnSm type="new" />
      </Game.Pad>
      {status === "countdown" ? (
        <Game.Countdown>{CountDown[countdown]}</Game.Countdown>
      ) : (
        <Game.StopWatch idle={status === "idle"} />
      )}
    </Game>
  );
};
