import { useEffect, useState } from "react";
import { queryStories, queryStory } from "@/lib/db";
import { useUser } from "@/hooks/useUser";
import { StoryWithId, User } from "interfaces";
import { ProvideStories } from "./types/ProvideStories.types";

export const useProvideStories = (gameCount: number): ProvideStories => {
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

  useEffect(() => {
    if (!user) {
      setStories([]);
    }
  }, [user]);

  // Add selected story to current position in array if user chooses play again from Archive
  const handlePlayArchiveStoryClick = async (id: StoryWithId["uid"]) => {
    const story = await queryStory(id);
    const destinationIdx = gameCount - 1;
    setStories([
      ...stories.slice(0, destinationIdx),
      story,
      ...stories.slice(destinationIdx),
    ]);
  };

  return { stories, isLoading, handlePlayArchiveStoryClick };
};
