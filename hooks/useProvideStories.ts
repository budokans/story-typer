import { useEffect, useState } from "react";
import { QueryDocumentSnapshot, DocumentData } from "@firebase/firestore-types";
import { queryStories } from "@/lib/db";
import { useUser } from "@/hooks/useUser";
import { StoryWithId } from "interfaces";

export const useProvideStories = (
  gameCount: number
): { stories: StoryWithId[]; isLoading: boolean } => {
  const { data: user } = useUser();
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
    if (user) {
      loadStories(null);
    }
  }, [user]);

  useEffect(() => {
    if (user && gameCount === stories.length) {
      loadStories(cursor);
    }
  }, [gameCount]);

  return { stories, isLoading };
};
