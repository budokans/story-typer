import { useQuery, useMutation, useQueryClient } from "react-query";
import { createFavorite, deleteFavorite, queryFavorite } from "@/lib/db";
import { Favorite, StoryWithId } from "interfaces";
import { useUser } from "./useUser";
import { GameState } from "./useGame.types";

export const useIsFavorite = (
  storyId: StoryWithId["uid"],
  gameStatus: GameState["status"]
): { isFavorited: boolean; handleFavoriteClick: () => void } => {
  const { data: user } = useUser();
  const userId = user && user.uid;
  const queryClient = useQueryClient();

  const { data: favoriteId } = useQuery(
    ["isFavorite", userId, storyId],
    () => queryFavorite(userId!, storyId),
    {
      enabled: !!user && gameStatus === "complete",
    }
  );

  const addFavoriteMutation = useMutation(
    (favorite: Favorite) => createFavorite(favorite),
    {
      onSuccess: () => queryClient.invalidateQueries("isFavorite"),
    }
  );

  const deleteFavoriteMutation = useMutation(
    (id: string) => deleteFavorite(id),
    {
      onSuccess: () => queryClient.invalidateQueries("isFavorite"),
    }
  );

  const handleFavoriteClick = () => {
    if (user) {
      favoriteId
        ? deleteFavoriteMutation.mutate(favoriteId)
        : addFavoriteMutation.mutate({ userId: user.uid, storyId: storyId });
    }
  };

  return { isFavorited: !!favoriteId, handleFavoriteClick };
};
