import * as IoTs from "io-ts";

export const StoryData = IoTs.type({
  storyId: IoTs.string,
  storyTitle: IoTs.string,
  storyHtml: IoTs.string,
});
export type StoryData = IoTs.TypeOf<typeof StoryData>;

export const FavoriteBody = IoTs.intersection([
  StoryData,
  IoTs.type({
    userId: IoTs.string,
  }),
]);
export type FavoriteBody = IoTs.TypeOf<typeof FavoriteBody>;

export const FavoriteResponse = IoTs.intersection([
  IoTs.type({
    id: IoTs.string,
    dateFavorited: IoTs.string,
  }),
  FavoriteBody,
]);
export type FavoriteResponse = IoTs.TypeOf<typeof FavoriteResponse>;
