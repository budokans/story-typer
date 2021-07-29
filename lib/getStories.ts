import axios from "axios";
import { Post, Story } from "../interfaces";
import { formatStories } from "./format";

const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";
const CATEGORIES = 112; // Submissions
const EXCLUDED_CATEGORIES = 16; // News
const PER_PAGE = 100;
const PAGE_LIMIT = 2;
const DEFAULT_PARAMS = [
  `per_page=${PER_PAGE}`,
  `categories=${CATEGORIES}`,
  `categories_exclude=${EXCLUDED_CATEGORIES}`,
];

const getParamsString = (params: string[]): string => params.join("&");

const getTimestamp = async (): Promise<string> => {
  // TO DO: db query
  return "2021-07-21T03:00:24";
};

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

const getPostsRecursive = async (url: string, pageNum = 1): Promise<Post[]> => {
  const onePage = await getPosts(url);
  if (pageNum < PAGE_LIMIT) {
    const nextPageUrl = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS, pageNum + 1);
    const nextPage = await getPostsRecursive(nextPageUrl, pageNum + 1);
    return nextPage ? [...nextPage, ...onePage] : onePage;
  } else {
    return onePage;
  }
};

export const getLatestPosts = (): Promise<Story[] | void> => {
  return getTimestamp()
    .then((timestamp) =>
      getLatestPostsUrl(API_ENDPOINT, DEFAULT_PARAMS, timestamp)
    )
    .then((url) => getPosts(url))
    .then((posts) => formatStories(posts))
    .catch((e) => console.error(e));
};

export const seed = (): Promise<Story[] | void> => {
  const url = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS);
  return getPostsRecursive(url)
    .then((posts) => formatStories(posts))
    .catch((e) => console.error(e));
};

export const testables = {
  getParamsString,
  getLatestPostsUrl,
  getPageUrl,
  getPosts,
};