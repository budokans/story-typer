import * as IoTs from "io-ts";

export const PrevGame = IoTs.type({
  userId: IoTs.string,
  storyId: IoTs.string,
  storyTitle: IoTs.string,
  storyHtml: IoTs.string,
  datePlayed: IoTs.string,
  score: IoTs.number,
});

export type PrevGame = IoTs.TypeOf<typeof PrevGame>;
