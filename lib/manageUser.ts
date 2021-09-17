import { GameState } from "@/hooks/useGame.types";
import { User, StoryWithId } from "interfaces";

export const createPostWinUser = (
  user: User,
  story: StoryWithId,
  score: GameState["wpm"]
): User => {
  const updatedPersonalBest =
    !user.personalBest || score > user.personalBest ? score : user.personalBest;
  const updatedLastTenScores = updateUserLastTenScores(
    user.lastTenScores,
    score
  );
  const updatedGamesPlayed = user.gamesPlayed + 1;
  const updatedNewestPlayedStoryPublishedDate = getMostRecentDate(
    user.newestPlayedStoryPublishedDate,
    story.datePublished
  );
  const updatedOldestPlayedStoryPublishedDate = getOldestDate(
    user.oldestPlayedStoryPublishedDate,
    story.datePublished
  );

  return {
    ...user,
    personalBest: updatedPersonalBest,
    lastTenScores: updatedLastTenScores,
    gamesPlayed: updatedGamesPlayed,
    newestPlayedStoryPublishedDate: updatedNewestPlayedStoryPublishedDate,
    oldestPlayedStoryPublishedDate: updatedOldestPlayedStoryPublishedDate,
  };
};

const getMostRecentDate = (
  storedDate: User["newestPlayedStoryPublishedDate"],
  currentStoryDate: StoryWithId["datePublished"]
) => {
  if (!storedDate) return currentStoryDate;
  const parsedStoredDate = Date.parse(storedDate);
  const parsedCurrentStoryDate = Date.parse(currentStoryDate);

  return parsedCurrentStoryDate > parsedStoredDate
    ? currentStoryDate
    : storedDate;
};

const getOldestDate = (
  storedDate: User["oldestPlayedStoryPublishedDate"],
  currentStoryDate: StoryWithId["datePublished"]
) => {
  if (!storedDate) return currentStoryDate;
  const parsedStoredDate = Date.parse(storedDate);
  const parsedCurrentStoryDate = Date.parse(currentStoryDate);

  return parsedCurrentStoryDate < parsedStoredDate
    ? currentStoryDate
    : storedDate;
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
