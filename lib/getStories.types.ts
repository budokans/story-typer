import { Story } from "api-schemas";

export type GetPostsOverPagesRecursive = (
  self: GetPostsOverPagesRecursive,
  url: string,
  pageNum: number,
  pageLimit: number
) => Promise<Story.Post[]>;

export type GetPostsOverPages = (
  url: string,
  pageNum: number,
  pageLimit: number
) => Promise<Story.Post[]>;
