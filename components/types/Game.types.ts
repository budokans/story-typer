import { FC, ChangeEvent } from "react";
import { GameState } from "@/hooks/types/Game.types";

interface Compound {
  Skeleton: FC<{ isLargeViewport: boolean }>;
  StoryHeader: FC<{ isLargeViewport: boolean }>;
  StoryText: FC;
  Pad: FC;
  Input: FC<{
    onInputClick: () => void;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
    error: boolean;
    gameStatus: GameState["status"];
  }>;
  ErrorAlert: FC;
  BtnSm: FC<{ type: "restart" | "new"; onClick: () => void }>;
  Countdown: FC<{
    active?: boolean;
  }>;
  StopWatch: FC<{
    gameStatus: GameState["status"];
  }>;
  Score: FC;
}

export type GameCompound = Compound & FC;
