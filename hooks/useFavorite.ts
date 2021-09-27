import { useState } from "react";

export const useFavorite = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };

  return { isFavorited, handleFavoriteClick };
};
