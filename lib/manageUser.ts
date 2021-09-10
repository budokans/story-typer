import { GameState } from "@/hooks/useGame.types";
import { User } from "interfaces";

export const createPostWinUser = (
  user: User,
  // story: StoryWithId,
  score: GameState["wpm"]
): User => ({
  ...user,
  personalBest:
    !user.personalBest || score > user.personalBest ? score : user.personalBest,
});
