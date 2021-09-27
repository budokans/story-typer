import { useState } from "react";
import { createFavorite } from "@/lib/db";
import { StoryWithId } from "interfaces";
import { useUser } from "./useUser";

export const useIsFavorite = (storyId: StoryWithId["uid"]) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: user } = useUser();

  const handleFavoriteClick = () => {
    if (user) {
      createFavorite(user.uid, storyId);
    }
  };

  return { isFavorited, handleFavoriteClick };
};
