import { ReactElement } from "react";
import { function as F, either as E, taskEither as TE, task as T } from "fp-ts";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { FaExclamation } from "react-icons/fa";
import { Favorite as FavoriteAPI } from "api-client";
import { Spinner } from "components";

interface FavoriteButtonProps {
  readonly storyDetails: FavoriteAPI.StoryData;
}

export const FavoriteButton = ({
  storyDetails,
}: FavoriteButtonProps): ReactElement => {
  const favoriteQuery = FavoriteAPI.useFavorite(storyDetails.storyId);
  const addFavoriteAPI = FavoriteAPI.useAddFavorite();
  const deleteFavoriteAPI = FavoriteAPI.useDeleteFavorite();
  const iconSize = "2.5rem";

  switch (favoriteQuery._tag) {
    case "loading":
      return <Spinner size="lg" color="gold" />;
    case "settled":
      return F.pipe(
        favoriteQuery.data,
        E.match(
          (error) => {
            console.error(error);
            return (
              <Tooltip
                label="Error checking favorite status"
                placement="right-end"
                openDelay={200}
              >
                <IconButton
                  aria-label="Error checking favorite status"
                  icon={<FaExclamation />}
                  fontSize="1.2rem"
                  isRound
                  bg="red.300"
                />
              </Tooltip>
            );
          },
          (favorite) =>
            favorite ? (
              <FavoriteButtonInternal
                icon={
                  deleteFavoriteAPI.isLoading ? (
                    <Spinner size="lg" color="gold" />
                  ) : (
                    <RiStarFill />
                  )
                }
                iconSize={iconSize}
                mutationCallback={() =>
                  deleteFavoriteAPI.mutateAsync(favorite.id)
                }
              />
            ) : (
              <FavoriteButtonInternal
                icon={
                  addFavoriteAPI.isLoading ? (
                    <Spinner size="lg" color="gold" />
                  ) : (
                    <RiStarLine />
                  )
                }
                iconSize={iconSize}
                mutationCallback={() =>
                  addFavoriteAPI.mutateAsync(storyDetails)
                }
              />
            )
        )
      );
  }
};

interface FavoriteButtonInternalProps {
  readonly icon: ReactElement;
  readonly iconSize: string;
  readonly mutationCallback: () => TE.TaskEither<unknown, string | void>;
}

const FavoriteButtonInternal = ({
  icon,
  iconSize,
  mutationCallback,
}: FavoriteButtonInternalProps): ReactElement => {
  return (
    <IconButton
      icon={icon}
      isRound
      cursor="pointer"
      fontSize={iconSize}
      aria-label="Favorite or unfavorite this story"
      bg="transparent"
      color="gold"
      onClick={() =>
        F.pipe(
          mutationCallback(),
          TE.fold(
            F.flow(
              // Force new line
              (error) => () => console.error(error),
              T.fromIO
            ),
            () => T.of(undefined)
          )
        )()
      }
      _hover={{ background: "transparent" }}
      _focus={{ boxShadow: "none" }}
    />
  );
};
