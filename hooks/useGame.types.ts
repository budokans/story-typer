export interface GameState {
  status: "pending" | "idle" | "countdown" | "inGame" | "complete";
  firstPlay: boolean;
  userError: boolean;
  userStoredInput: string;
  userCurrentInput: string;
  wpm: number;
}

export type GameAction =
  | { type: "storiesLoaded" }
  | { type: "startCountdown" }
  | { type: "countdownTick" }
  | { type: "countdownComplete" }
  | { type: "inputValueChange"; inputValue: string }
  | { type: "errorFree" }
  | { type: "userTypingError" }
  | { type: "wordCompleted" }
  | { type: "win"; wpm: number }
  | { type: "reset" }
  | { type: "next" };
