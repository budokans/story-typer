import { useEffect, useState } from "react";
import { getStories, getStory } from "@/lib/db";
import { StoryWithId, User } from "interfaces";
import { useUserContext } from "@/context/user";

interface ProvideStories {
  readonly stories: readonly StoryWithId[];
  readonly isLoading: boolean;
  readonly handlePlayArchiveStoryClick: (id: StoryWithId["uid"]) => void;
}

export const useProvideStories = (gameCount: number): ProvideStories => {
  const user = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<StoryWithId[]>([]);

  const loadStories = async (user: User) => {
    const batch = await getStories(
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
  }, [gameCount, stories.length, user]);

  useEffect(() => {
    if (!user) {
      setStories([]);
    }
  }, [user]);

  // Add selected story to current position in array if user chooses play again from Archive
  const handlePlayArchiveStoryClick = async (id: StoryWithId["uid"]) => {
    const story = await getStory(id);
    const destinationIdx = gameCount - 1;
    setStories([
      ...stories.slice(0, destinationIdx),
      story,
      ...stories.slice(destinationIdx),
    ]);
  };

  return { stories, isLoading, handlePlayArchiveStoryClick };
};
