import { useQuery, useMutation, useQueryClient } from "react-query";
import { createFavorite, deleteFavorite, getFavorite } from "@/lib/db";
import { useUserContext } from "@/context/user";
import { FavoriteBase, Favorite } from "interfaces";

export const useFavorite = (
  storyDetails: FavoriteBase
): { isFavorited: boolean; handleFavoriteClick: () => void } => {
  const user = useUserContext();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const { data: favoriteId } = useQuery(
    ["isFavorite", userId, storyDetails.storyId],
    () => getFavorite(userId!, storyDetails.storyId)
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
