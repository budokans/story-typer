import { User, Story } from "api-schemas";

type User = User.User;
type Story = Story.StoryResponse;

export const createPostWinUser = (
  user: User,
  story: Story,
  score: number
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

export const createPostSkipUser = (user: User, story: Story): User => ({
  ...user,
  newestPlayedStoryPublishedDate: getMostRecentDate(
    user.newestPlayedStoryPublishedDate,
    story.datePublished
  ),
  oldestPlayedStoryPublishedDate: getOldestDate(
    user.oldestPlayedStoryPublishedDate,
    story.datePublished
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
  storedDate: User["oldestPlayedStoryPublishedDate"],
  currentStoryDate: Story["datePublished"]
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
