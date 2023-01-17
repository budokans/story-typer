import { ReactElement } from "react";
import { IconButton } from "@chakra-ui/button";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useFavorite } from "@/hooks";
import { Favorite } from "api-schemas";

interface FavoriteButtonProps {
  readonly storyDetails: Favorite.StoryData;
}

export const FavoriteButton = ({
  storyDetails,
}: FavoriteButtonProps): ReactElement => {
  const { handleFavoriteClick, isFavorited } = useFavorite(storyDetails);

  return (
    <IconButton
      icon={isFavorited ? <RiStarFill /> : <RiStarLine />}
      isRound
      cursor="pointer"
      fontSize="2.5rem"
      aria-label="favorite this story"
      bg="transparent"
      color="gold"
      onClick={handleFavoriteClick}
      _hover={{ background: "transparent" }}
      _focus={{ boxShadow: "none" }}
    />
  );
};
