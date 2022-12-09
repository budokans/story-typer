import * as IoTs from "io-ts";

export const Story = IoTs.intersection([
  IoTs.partial({ uid: IoTs.string }),
  IoTs.type({
    title: IoTs.string,
    authorBio: IoTs.string,
    storyHtml: IoTs.string,
    storyText: IoTs.string,
    url: IoTs.string,
    datePublished: IoTs.string,
  }),
]);

export type Story = IoTs.TypeOf<typeof Story>;
