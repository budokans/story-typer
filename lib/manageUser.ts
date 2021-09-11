import { GameState } from "@/hooks/useGame.types";
import { User, StoryWithId } from "interfaces";

export const createPostWinUser = (
  user: User,
  story: StoryWithId,
  score: GameState["wpm"]
): User => ({
  ...user,
  personalBest:
    !user.personalBest || score > user.personalBest ? score : user.personalBest,
  lastTenScores: updateUserLastTenScores(user.lastTenScores, score),
  gamesPlayed: user.gamesPlayed + 1,
  newestPlayedStoryPublishedDate: getMostRecentDate(
    user.newestPlayedStoryPublishedDate,
    story.datePublished
  ),
});

const getMostRecentDate = (
  storedDate: User["newestPlayedStoryPublishedDate"],
  newDate: StoryWithId["datePublished"]
) => {
  if (!storedDate) return newDate;
  return storedDate.localeCompare(newDate) ? newDate : storedDate;
};

const updateUserLastTenScores = (
  scores: User["lastTenScores"],
  newScore: GameState["wpm"]
) => {
  return scores.length < 10
    ? [newScore, ...scores]
    : [newScore, ...scores.slice(0, scores.length - 1)];
};

const getUserAverageScore = (scores: User["lastTenScores"]): number =>
  Math.round(
    scores.reduce((acc, currentVal) => acc + currentVal) / scores.length
  );

export const getUserAverageScoresDisplay = (
  scores: User["lastTenScores"]
): number | "TBA" =>
  scores.length === 0 ? "TBA" : getUserAverageScore(scores);
