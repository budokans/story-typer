import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Story as DBStory } from "db";
import { Story as StorySchema, User } from "api-schemas";
import { useUserContext } from "@/context/user";

type Document = DBStory.StoryDocument;
type Response = StorySchema.StoryResponse;

const serializeStory = (storyDoc: Document): Response => ({
  id: storyDoc.id,
  title: storyDoc.title,
  authorBio: storyDoc.authorBio,
  storyHtml: storyDoc.storyHtml,
  storyText: storyDoc.storyText,
  url: storyDoc.url,
  datePublished: storyDoc.datePublished,
  dateScraped: (storyDoc.dateScraped as Timestamp).toDate().toISOString(),
});

interface ProvideStories {
  readonly stories: readonly Response[];
  readonly isLoading: boolean;
  readonly handlePlayArchiveStoryClick: (id: string) => void;
}

export const useProvideStories = (gameCount: number): ProvideStories => {
  const user = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<readonly Response[]>([]);

  const loadStories = async (user: User.User) => {
    const batch = await DBStory.getStories(
      user!.newestPlayedStoryPublishedDate,
      user!.oldestPlayedStoryPublishedDate
    );

    if (batch) {
      const serialized = batch.map(serializeStory);
      setStories((prevStories) => {
        return [...prevStories, ...serialized];
      });
    }

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
  const handlePlayArchiveStoryClick = async (id: string) => {
    const story = await DBStory.getStory(id);
    if (story) {
      const serialized = serializeStory(story);
      const destinationIdx = gameCount - 1;
      setStories([
        ...stories.slice(0, destinationIdx),
        serialized,
        ...stories.slice(destinationIdx),
      ]);
    }
  };

  return { stories, isLoading, handlePlayArchiveStoryClick };
};
