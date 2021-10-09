import { StoryWithId } from "interfaces";
import { ChangeEvent } from "react";
import { Timer } from "./useTimer";

export interface GameState {
  status:
    | "pending"
    | "idle"
    | "countdown"
    | "inGame"
    | "complete"
    | "outOfTime";
  userError: boolean;
  userStoredInput: string;
  userCurrentInput: string;
  wpm: number;
}

export type GameAction =
  | { type: "storiesLoading" }
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
  | { type: "next" }
  | { type: "outOfTime" };

export interface UseGame {
  currentStory: StoryWithId;
  status: GameState["status"];
  inputValue: string;
  userError: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInitCountdown: () => void;
  countdown: number;
  timer: Timer;
  wpm: GameState["wpm"];
  onResetClick: () => void;
  onSkipClick: () => void;
  onNextClick: () => void;
}
