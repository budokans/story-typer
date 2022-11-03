import { IconButton } from "@chakra-ui/button";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useFavorite } from "@/hooks";
import { FavoriteBase } from "interfaces";
import { ReactElement } from "react";

interface FavoriteButtonProps {
  readonly storyDetails: FavoriteBase;
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
