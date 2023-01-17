import * as IoTs from "io-ts";

export const StoryData = IoTs.type({
  storyId: IoTs.string,
  storyTitle: IoTs.string,
  storyHtml: IoTs.string,
});
export type StoryData = IoTs.TypeOf<typeof StoryData>;

export const Favorite = IoTs.intersection([
  StoryData,
  IoTs.type({
    userId: IoTs.string,
    dateFavorited: IoTs.string,
  }),
]);

export type Favorite = IoTs.TypeOf<typeof Favorite>;
