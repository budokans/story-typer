import { queryStories } from "@/lib/db";

export const useProvideStories = async () => {
  // First, let's fetch 10 stories from the top of the db and return them,
  // Then they can be passed to a context provider and read from useGame();
  // Then add the functionality in useGame() to create "games" in the database.
  // After which, we can write the functionality here where first a user is checked for, and then either we return stories new to them, or just the ten newest stories in the databse.

  const stories = await queryStories();
  return stories;
};
