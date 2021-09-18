import { useEffect, useState } from "react";
import { queryStories } from "@/lib/db";
import { useUser } from "@/hooks/useUser";
import { StoryWithId } from "interfaces";

export const useProvideStories = (
  gameCount: number
): { stories: StoryWithId[]; isLoading: boolean } => {
  const { data: user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<StoryWithId[]>([]);

  const loadStories = async () => {
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
    if (user) {
      loadStories();
    }
  }, [user]);

  useEffect(() => {
    if (user && gameCount === stories.length) {
      loadStories();
    }
  }, [gameCount]);

  return { stories, isLoading };
};
