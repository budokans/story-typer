import { IconButton } from "@chakra-ui/button";
import { RiStarFill, RiStarLine } from "react-icons/ri";

interface FavoriteButtonProps {
  isFavorited: boolean | undefined;
  onFavoriteClick: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorited,
  onFavoriteClick,
}) => {
  return (
    <IconButton
      icon={isFavorited ? <RiStarFill /> : <RiStarLine />}
      isRound
      cursor="pointer"
      fontSize="2.5rem"
      aria-label="favorite this story"
      bg="transparent"
      color="gold"
      onClick={onFavoriteClick}
      _hover={{ background: "transparent" }}
      _focus={{ boxShadow: "none" }}
    />
  );
};
