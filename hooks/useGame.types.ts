export interface GameState {
  status: "idle" | "countdown" | "inGame" | "complete";
  countdown: number;
  userError: boolean;
  userStoredInput: string;
  userCurrentInput: string;
  story: { storyText: string; title: string };
}

export type GameAction =
  | { type: "startCountdown" }
  | { type: "countdownTick" }
  | { type: "countdownComplete" }
  | { type: "inputValueChange"; inputValue: string }
  | { type: "errorFree" }
  | { type: "userTypingError" }
  | { type: "wordCompleted" }
  | { type: "win" };
