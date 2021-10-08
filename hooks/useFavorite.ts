import { useQuery, useMutation, useQueryClient } from "react-query";
import { createFavorite, deleteFavorite, queryFavorite } from "@/lib/db";
import { FavoriteBase, Favorite } from "interfaces";
import { useUser } from "./useUser";

export const useFavorite = (
  storyDetails: FavoriteBase
): { isFavorited: boolean; handleFavoriteClick: () => void } => {
  const { data: user } = useUser();
  const userId = user && user.uid;
  const queryClient = useQueryClient();

  const { data: favoriteId } = useQuery(
    ["isFavorite", userId, storyDetails.storyId],
    () => queryFavorite(userId!, storyDetails.storyId)
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
      onSuccess: () => {
        queryClient.invalidateQueries("isFavorite");
        queryClient.invalidateQueries("favorites");
      },
    }
  );

  const handleFavoriteClick = () => {
    if (user) {
      favoriteId
        ? deleteFavoriteMutation.mutate(favoriteId)
        : addFavoriteMutation.mutate({
            userId: user.uid,
            ...storyDetails,
            dateFavorited: new Date().toISOString(),
          });
    }
  };

  return { isFavorited: !!favoriteId, handleFavoriteClick };
};
