import { Post } from "../interfaces";

export type GetPostsOverPagesRecursive = (
  self: GetPostsOverPagesRecursive,
  url: string,
  pageNum: number,
  pageLimit: number
) => Promise<Post[]>;

export type GetPostsOverPages = (
  url: string,
  pageNum: number,
  pageLimit: number
) => Promise<Post[]>;
