import * as IoTs from "io-ts";

export const ScrapedStory = IoTs.type({
  title: IoTs.string,
  authorBio: IoTs.string,
  storyHtml: IoTs.string,
  storyText: IoTs.string,
  url: IoTs.string,
  datePublished: IoTs.string,
  dateScraped: IoTs.string,
});
export type ScrapedStory = IoTs.TypeOf<typeof ScrapedStory>;

export const Story = IoTs.intersection([
  IoTs.type({ uid: IoTs.string }),
  ScrapedStory,
]);
export type Story = IoTs.TypeOf<typeof Story>;
