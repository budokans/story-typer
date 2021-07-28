import axios from "axios";
import { Scrape, Story } from "../interfaces";
import { formatStories } from "./formatScrapes";

export const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";
const CATEGORIES = 112; // Submissions
const EXCLUDED_CATEGORIES = 16; // News
const PER_PAGE = 100;
const PAGE_LIMIT = 2;
let PAGE_NUMBER = 1;
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

const getScrapeLatestUrl = (
  endpoint: string,
  defaults: string[],
  timestamp: string
): string => {
  const defaultParams = getParamsString(defaults);
  return encodeURI(`${endpoint}?${defaultParams}&after=${timestamp}`);
};

const getPageUrl = (
  endpoint: string,
  defaults: string[],
  pageNum: number
): string => {
  const defaultParams = getParamsString(defaults);
  return encodeURI(`${endpoint}?${defaultParams}&page=${pageNum}`);
};

const getPosts = async (url: string): Promise<Scrape[]> => {
  const { data: scrapes } = await axios.get(url);
  return scrapes;
};

const scrapeAll = async (url: string): Promise<Scrape[]> => {
  const onePage = await getPosts(url);
  PAGE_NUMBER++;
  if (PAGE_NUMBER <= PAGE_LIMIT) {
    const nextPageUrl = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS, PAGE_NUMBER);
    const nextPage = await scrapeAll(nextPageUrl);
    if (nextPage) {
      return [...nextPage, ...onePage];
    } else {
      return onePage;
    }
  } else {
    return onePage;
  }
};

export const scrapeLatest = (): Promise<Story[] | void> => {
  return getTimestamp()
    .then((timestamp) =>
      getScrapeLatestUrl(API_ENDPOINT, DEFAULT_PARAMS, timestamp)
    )
    .then((url) => getPosts(url))
    .then((posts) => formatStories(posts))
    .catch((e) => console.error(e));
};

export const seed = (): Promise<Story[] | void> => {
  const url = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS, PAGE_NUMBER);
  return scrapeAll(url)
    .then((scrapes) => {
      PAGE_NUMBER = 1;
      return formatStories(scrapes);
    })
    .catch((e) => console.error(e));
};

export const testables = {
  getParamsString,
  getScrapeLatestUrl,
  getPageUrl,
  getPosts,
};
