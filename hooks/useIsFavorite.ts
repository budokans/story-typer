import { useQuery } from "react-query";
import { createFavorite, queryFavorite } from "@/lib/db";
import { StoryWithId } from "interfaces";
import { useUser } from "./useUser";
import { GameState } from "./useGame.types";

export const useIsFavorite = (
  storyId: StoryWithId["uid"],
  gameStatus: GameState["status"]
) => {
  const { data: user } = useUser();
  const userId = user && user.uid;
  const { data: isFavorited } = useQuery(
    ["isFavorite", userId, storyId],
    () => queryFavorite(userId!, storyId),
    {
      enabled: !!user && gameStatus === "complete",
    }
  );

  const handleFavoriteClick = () => {
    if (user) {
      createFavorite(user.uid, storyId);
    }
  };

  return { isFavorited, handleFavoriteClick };
};
