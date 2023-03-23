import { User as UserAPI, Story as StoryAPI } from "api-client";

type User = UserAPI.Response;
type Story = StoryAPI.Response;

export const buildPostWinUser = (
  user: User,
  story: Story,
  score: number,
  leastRecentStoryPublishedDate: string
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
    story.datePublished,
    leastRecentStoryPublishedDate
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

export const buildPostSkipUser = (
  user: User,
  story: Story,
  leastRecentStoryPublishedDate: string
): User => ({
  ...user,
  newestPlayedStoryPublishedDate: getMostRecentDate(
    user.newestPlayedStoryPublishedDate,
    story.datePublished
  ),
  oldestPlayedStoryPublishedDate: getOldestDate(
    user.oldestPlayedStoryPublishedDate,
    story.datePublished,
    leastRecentStoryPublishedDate
  ),
});

const getMostRecentDate = (
  storedDate: User["newestPlayedStoryPublishedDate"],
  currentStoryDate: Story["datePublished"]
) => {
  if (!storedDate) return currentStoryDate;
  const parsedStoredDate = Date.parse(storedDate);
  const parsedCurrentStoryDate = Date.parse(currentStoryDate);

  return parsedCurrentStoryDate > parsedStoredDate
    ? currentStoryDate
    : storedDate;
};

const getOldestDate = (
  oldestPlayedStoryPublishedDate: string | null,
  currentStoryDate: string,
  leastRecentStoryPublishedDate: string
) => {
  if (!oldestPlayedStoryPublishedDate) return currentStoryDate;
  const parsedStoredDate = Date.parse(oldestPlayedStoryPublishedDate);
  const parsedCurrentStoryDate = Date.parse(currentStoryDate);
  const parsedLeastRecentStoryPublishedDate = Date.parse(
    leastRecentStoryPublishedDate
  );

  if (parsedCurrentStoryDate === parsedLeastRecentStoryPublishedDate) {
    return null;
  }
  return parsedCurrentStoryDate < parsedStoredDate
    ? currentStoryDate
    : oldestPlayedStoryPublishedDate;
};

const updateUserLastTenScores = (
  scores: User["lastTenScores"],
  newScore: number
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
