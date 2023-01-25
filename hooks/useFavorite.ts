import { useQuery, useMutation, useQueryClient } from "react-query";
import { Favorite as DBFavorite } from "db";
import { useUserContext } from "@/context/user";
import { Favorite } from "api-schemas";
import { Timestamp } from "firebase/firestore";

const serializeFavorite = (
  favoriteDoc: DBFavorite.FavoriteDocument | undefined
): Favorite.FavoriteResponse | undefined =>
  favoriteDoc
    ? {
        id: favoriteDoc.id,
        userId: favoriteDoc.userId,
        storyId: favoriteDoc.storyId,
        storyTitle: favoriteDoc.storyTitle,
        storyHtml: favoriteDoc.storyHtml,
        dateFavorited: (favoriteDoc.dateFavorited as Timestamp)
          .toDate()
          .toISOString(),
      }
    : undefined;

export const useFavorite = (
  storyDetails: Favorite.StoryData
): { isFavorited: boolean; handleFavoriteClick: () => void } => {
  const user = useUserContext();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const { data: favoriteDoc } = useQuery(
    ["isFavorite", userId, storyDetails.storyId],
    () => DBFavorite.getFavorite(userId!, storyDetails.storyId)
  );

  const favorite = serializeFavorite(favoriteDoc);

  const addFavoriteMutation = useMutation(
    (favorite: Favorite.FavoriteBody) => DBFavorite.createFavorite(favorite),
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
      return favorite
        ? deleteFavoriteMutation.mutate(favorite.id)
        : addFavoriteMutation.mutate({
            userId: user.uid,
            ...storyDetails,
          });
    }
  };

  return { isFavorited: !!favorite?.id, handleFavoriteClick };
};
