import { StoryWithId } from "interfaces";
import { ChangeEvent } from "react";
import { Timer } from "./Timer.types";

export interface GameState {
  readonly status:
    | "pending"
    | "idle"
    | "countdown"
    | "inGame"
    | "complete"
    | "outOfTime";
  readonly userError: boolean;
  readonly userInput: string;
  readonly wpm: number;
}

export type GameAction =
  | { readonly type: "storiesLoading" }
  | { readonly type: "storiesLoaded" }
  | { readonly type: "startCountdown" }
  | { readonly type: "countdownTick" }
  | { readonly type: "countdownComplete" }
  | { readonly type: "inputValueChange"; readonly inputValue: string }
  | { readonly type: "errorFree" }
  | { readonly type: "userTypingError" }
  | { readonly type: "win"; readonly wpm: number }
  | { readonly type: "reset" }
  | { readonly type: "next" }
  | { readonly type: "outOfTime" };

export interface UseGame {
  readonly currentStory: StoryWithId;
  readonly status: GameState["status"];
  readonly inputValue: string;
  readonly userError: boolean;
  readonly onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly onInitCountdown: () => void;
  readonly countdown: number;
  readonly timer: Timer;
  readonly wpm: GameState["wpm"];
  readonly onResetClick: () => void;
  readonly onSkipClick: () => void;
  readonly onNextClick: () => void;
}
