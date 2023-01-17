import * as IoTs from "io-ts";

export const Post = IoTs.type({
  date: IoTs.string,
  link: IoTs.string,
  title: IoTs.type({
    rendered: IoTs.string,
  }),
  content: IoTs.type({
    rendered: IoTs.string,
  }),
});
export type Post = IoTs.TypeOf<typeof Post>;

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
  IoTs.type({ id: IoTs.string }),
  ScrapedStory,
]);
export type Story = IoTs.TypeOf<typeof Story>;
