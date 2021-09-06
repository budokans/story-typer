import { useEffect, useState } from "react";
import { QueryDocumentSnapshot, DocumentData } from "@firebase/firestore-types";
import { queryStories } from "@/lib/db";
import { useAuth } from "@/context/auth";
import { StoryWithId } from "interfaces";

export const useProvideStories = (
  gameCount: number
): { stories: StoryWithId[]; isLoading: boolean } => {
  const { user, isLoading: authIsLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<StoryWithId[]>([]);
  const [cursor, setCursor] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const loadStories = async (
    snapshot: QueryDocumentSnapshot<DocumentData> | null
  ) => {
    const { batch, last } = await queryStories(snapshot);
    setCursor(last);
    setStories((prevStories) => {
      return [...prevStories, ...batch];
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!authIsLoading) {
      loadStories(null);
    }
  }, [authIsLoading]);

  useEffect(() => {
    if (!authIsLoading && gameCount === stories.length) {
      loadStories(cursor);
    }
  }, [gameCount]);

  return { stories, isLoading };
};
