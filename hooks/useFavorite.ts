import { useQuery, useMutation, useQueryClient } from "react-query";
import { Favorite as DBFavorite } from "db";
import { useUserContext } from "@/context/user";
import { Favorite } from "api-schemas";

export const useFavorite = (
  storyDetails: Favorite.StoryData
): { isFavorited: boolean; handleFavoriteClick: () => void } => {
  const user = useUserContext();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const { data: favoriteId } = useQuery(
    ["isFavorite", userId, storyDetails.storyId],
    () => DBFavorite.getFavorite(userId!, storyDetails.storyId)
  );

  const addFavoriteMutation = useMutation(
    (favorite: Favorite.Favorite) => DBFavorite.createFavorite(favorite),
    {
      onSuccess: () => queryClient.invalidateQueries("isFavorite"),
    }
  );

  const deleteFavoriteMutation = useMutation(
    (id: string) => DBFavorite.deleteFavorite(id),
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
