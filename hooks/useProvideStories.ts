import { useEffect, useState } from "react";
import { queryStories } from "@/lib/db";
import { useUser } from "@/hooks/useUser";
import { StoryWithId, User } from "interfaces";

export const useProvideStories = (
  gameCount: number
): { stories: StoryWithId[]; isLoading: boolean } => {
  const { data: user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<StoryWithId[]>([]);

  const loadStories = async (user: User) => {
    const batch = await queryStories(
      user!.newestPlayedStoryPublishedDate,
      user!.oldestPlayedStoryPublishedDate
    );
    setStories((prevStories) => {
      return [...prevStories, ...batch];
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (user && stories.length === 0) {
      loadStories(user);
    }
  }, [user, stories]);

  useEffect(() => {
    if (user && gameCount === stories.length) {
      setIsLoading(true);
      loadStories(user);
    }
  }, [gameCount, stories.length]);

  return { stories, isLoading };
};
