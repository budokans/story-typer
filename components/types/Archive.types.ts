import { Dispatch, FC, SetStateAction } from "react";
import { PrevGame, FavoriteBase } from "../../interfaces";

interface Compound {
  PageTitle: FC;
  Toggles: FC<{
    value: "all" | "favorites";
    onSetValue: (nextValue: "all" | "favorites") => void;
  }>;
  Card: FC;
  CardHeader: FC<{ id: number }>;
  CardTitle: FC;
  CardScore: FC;
  CardDate: FC<{ dateString: PrevGame["datePlayed"] }>;
  CloseCardIcon: FC<{ id: number }>;
  CardExpandedSection: FC<{ id: number }>;
  FullStory: FC<{ story: PrevGame["storyHtml"] }>;
  Buttons: FC;
  PlayAgainButton: FC<{ storyId: PrevGame["storyId"] }>;
  DeleteFavoriteButton: FC<{ storyDetails: FavoriteBase }>;
  BackToGameButton: FC;
}

export interface ExpandedContext {
  expandedIdx: number | null;
  setExpandedIdx: Dispatch<SetStateAction<number | null>>;
}

export type ArchiveCompound = FC & Compound;
