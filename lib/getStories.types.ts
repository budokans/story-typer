import { Story } from "api-schemas";

export type Post = Story.Post;
export type Posts = readonly Post[];
export type ScrapedStory = Story.StoryBody;
export type ScrapedStories = readonly ScrapedStory[];

export type GetPostsOverPagesRecursive = (
  self: GetPostsOverPagesRecursive,
  url: string,
  pageNum: number,
  pageLimit: number
) => Promise<Posts>;

export type GetPostsOverPages = (
  url: string,
  pageNum: number,
  pageLimit: number
) => Promise<Posts>;
