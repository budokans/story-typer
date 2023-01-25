import * as IoTs from "io-ts";

export const PrevGameBody = IoTs.type({
  userId: IoTs.string,
  storyId: IoTs.string,
  storyTitle: IoTs.string,
  storyHtml: IoTs.string,
  score: IoTs.number,
});
export type PrevGameBody = IoTs.TypeOf<typeof PrevGameBody>;

export const PrevGameResponse = IoTs.intersection([
  IoTs.type({ id: IoTs.string, datePlayed: IoTs.string }),
  PrevGameBody,
]);
export type PrevGameResponse = IoTs.TypeOf<typeof PrevGameResponse>;
