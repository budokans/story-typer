import { Story } from "interfaces";

export interface GameState {
  status: "loading" | "idle" | "countdown" | "inGame" | "complete";
  userError: boolean;
  userStoredInput: string;
  userCurrentInput: string;
  gameCount: number;
  stories: Story[];
}

export type GameAction =
  | { type: "storiesLoaded"; stories: Story[] }
  | { type: "startCountdown" }
  | { type: "countdownTick" }
  | { type: "countdownComplete" }
  | { type: "inputValueChange"; inputValue: string }
  | { type: "errorFree" }
  | { type: "userTypingError" }
  | { type: "wordCompleted" }
  | { type: "win" }
  | { type: "reset" };
