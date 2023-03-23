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

export const StoryBody = IoTs.type({
  title: IoTs.string,
  authorBio: IoTs.string,
  storyHtml: IoTs.string,
  storyText: IoTs.string,
  url: IoTs.string,
  datePublished: IoTs.string,
});
export type StoryBody = IoTs.TypeOf<typeof StoryBody>;

export const StoryResponse = IoTs.intersection([
  IoTs.type({ id: IoTs.string, dateScraped: IoTs.string }),
  StoryBody,
]);
export type StoryResponse = IoTs.TypeOf<typeof StoryResponse>;
