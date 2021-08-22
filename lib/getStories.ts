import axios from "axios";
import { Post, Story } from "../interfaces";
import { createStory, getLatestTimestamp, incrementStoriesCount } from "./db";
import { formatStories } from "./format";
import {
  GetPostsOverPages,
  GetPostsOverPagesRecursive,
} from "./getStories.types";

const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";
const CATEGORIES = 112; // Submissions
const EXCLUDED_CATEGORIES = 16; // News
const PER_PAGE = 100;
const STARTING_PAGE = 1;
const PAGE_LIMIT = 15;
const DEFAULT_PARAMS = [
  `per_page=${PER_PAGE}`,
  `categories=${CATEGORIES}`,
  `categories_exclude=${EXCLUDED_CATEGORIES}`,
];

const getParamsString = (params: string[]): string => params.join("&");

const getLatestPostsUrl = (
  endpoint: string,
  defaults: string[],
  timestamp: string
): string => {
  const defaultParamsStr = getParamsString(defaults);
  return encodeURI(`${endpoint}?${defaultParamsStr}&after=${timestamp}`);
};

const getPageUrl = (
  endpoint: string,
  defaults: string[],
  pageNum = 1
): string => {
  const defaultParamsStr = getParamsString(defaults);
  return encodeURI(`${endpoint}?${defaultParamsStr}&page=${pageNum}`);
};

const getPosts = async (url: string): Promise<Post[]> => {
  const { data: posts } = await axios.get(url);
  return posts;
};

const getPostsOverPagesRecursive = async (
  self: GetPostsOverPagesRecursive,
  url: string,
  pageNum: number,
  pageLimit: number
): Promise<Post[]> => {
  const onePage = await getPosts(url);
  if (pageNum < pageLimit) {
    const nextPageUrl = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS, pageNum + 1);
    const nextPage = await self(self, nextPageUrl, pageNum + 1, pageLimit);
    return [...nextPage, ...onePage];
  } else {
    return onePage;
  }
};

const getPostsOverPagesFactory = (
  recursiveFn: GetPostsOverPagesRecursive
): GetPostsOverPages => recursiveFn.bind(null, recursiveFn);

const getPostsOverPages: GetPostsOverPages = getPostsOverPagesFactory(
  getPostsOverPagesRecursive
);

const getLatestStories = (): Promise<Story[] | void> => {
  return getLatestTimestamp()
    .then((timestamp) =>
      getLatestPostsUrl(API_ENDPOINT, DEFAULT_PARAMS, timestamp)
    )
    .then((url) => getPosts(url))
    .then((posts) => formatStories(posts))
    .catch((e) => console.error(e));
};

export const addLatestStories = (): Promise<number | void> => {
  return getLatestStories()
    .then((stories) => {
      if (stories) {
        stories.forEach(createStory);
        const storiesCount = stories.length;
        incrementStoriesCount(storiesCount);
        return storiesCount;
      }
    })
    .catch((e) => console.error(e));
};

export const seed = (): Promise<void> => {
  const url = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS);
  return getPostsOverPages(url, STARTING_PAGE, PAGE_LIMIT)
    .then((posts) => formatStories(posts))
    .then((stories) => {
      stories.forEach(createStory);
      incrementStoriesCount(stories.length);
    })
    .catch((e) => console.error(e));
};

export const testables = {
  getParamsString,
  getLatestPostsUrl,
  getPageUrl,
  getPosts,
  getPostsOverPagesRecursive,
  getPostsOverPagesFactory,
  getPostsOverPages,
  getLatestStories,
};
