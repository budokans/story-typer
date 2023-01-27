import { ReactElement } from "react";
import { function as F, either as E, taskEither as TE, task as T } from "fp-ts";
import { IconButton } from "@chakra-ui/button";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { Favorite as FavoriteAPI } from "api-client";
import { Favorite as FavoriteSchema } from "api-schemas";
import { DocumentReference } from "firebase/firestore";
import { SkeletonCircle } from "@chakra-ui/react";

interface FavoriteButtonProps {
  readonly storyDetails: FavoriteSchema.StoryData;
}

export const FavoriteButton = ({
  storyDetails,
}: FavoriteButtonProps): ReactElement => {
  const { data, isLoading } = FavoriteAPI.useFavorite(storyDetails.storyId);
  const addFavoriteMutation = FavoriteAPI.useAddFavorite();
  const deleteFavoriteMutation = FavoriteAPI.useDeleteFavorite();
  const iconSize = "2.5rem";

  return F.pipe(
    data,
    E.match(
      (error) => {
        if (error) console.error(error);
        if (isLoading) return <SkeletonCircle size={iconSize} />;
        return (
          <FavoriteButtonInternal
            icon={<RiStarLine />}
            iconSize={iconSize}
            mutationCallback={() => addFavoriteMutation(storyDetails)}
          />
        );
      },
      ({ id }) => (
        <FavoriteButtonInternal
          icon={<RiStarFill />}
          iconSize={iconSize}
          mutationCallback={() => deleteFavoriteMutation(id)}
        />
      )
    )
  );
};

interface FavoriteButtonInternalProps {
  readonly icon: ReactElement;
  readonly iconSize: string;
  readonly mutationCallback: () => TE.TaskEither<
    unknown,
    DocumentReference<FavoriteAPI.Document> | void
  >;
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
      aria-label="favorite this story"
      bg="transparent"
      color="gold"
      onClick={() =>
        F.pipe(
          mutationCallback(),
          TE.fold(
            (error) =>
              F.pipe(
                // Force new line
                () => console.error(error),
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
