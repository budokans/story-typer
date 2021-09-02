import { StoryWithId } from "interfaces";

export interface GameState {
  status: "pending" | "idle" | "countdown" | "inGame" | "complete";
  userError: boolean;
  userStoredInput: string;
  userCurrentInput: string;
  gameCount: number;
  stories: StoryWithId[];
  wpm: number;
}

export type GameAction =
  | { type: "storiesLoaded"; stories: StoryWithId[] }
  | { type: "startCountdown" }
  | { type: "countdownTick" }
  | { type: "countdownComplete" }
  | { type: "inputValueChange"; inputValue: string }
  | { type: "errorFree" }
  | { type: "userTypingError" }
  | { type: "wordCompleted" }
  | { type: "win"; wpm: number }
  | { type: "reset" };
