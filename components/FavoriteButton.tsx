import { IconButton } from "@chakra-ui/button";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useIsFavorite } from "@/hooks/useIsFavorite";
import { StoryWithId } from "interfaces";

export const FavoriteButton: React.FC<{
  storyId: StoryWithId["uid"];
}> = ({ storyId }) => {
  const { handleFavoriteClick, isFavorited } = useIsFavorite(storyId);

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
