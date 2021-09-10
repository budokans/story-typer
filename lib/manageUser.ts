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

const getUserAverageScore = (scores: User["lastTenScores"]): number =>
  Math.round(
    scores.reduce((acc, currentVal) => acc + currentVal) / scores.length
  );

export const getUserAverageScoreDisplay = (
  scores: User["lastTenScores"]
): number | "TBA" =>
  scores.length === 0 ? "TBA" : getUserAverageScore(scores);