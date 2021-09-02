import { useEffect, useState } from "react";
import { queryStories } from "@/lib/db";
import { useAuth } from "@/context/auth";
import { Story } from "interfaces";

export const useProvideStories = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  // First, let's fetch 10 stories from the top of the db and return them,
  // Then they can be passed to a context provider and read from useGame();
  // Then add the functionality in useGame() to create "games" in the database.
  // After which, we can write the functionality here where first a user is checked for, and then either we return stories new to them, or just the ten newest stories in the database.

  const loadStories = async () => {
    const batch = await queryStories();
    setStories(batch);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!authIsLoading) {
      loadStories();
    }
  }, [authIsLoading]);

  return { stories, isLoading };
};
