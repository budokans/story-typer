import axios from "axios";
import { Scrape, Story } from "../interfaces";
import { pruneScrapes } from "./formatScrapes";

export const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";
const CATEGORIES = 112; // Submissions
const EXCLUDED_CATEGORIES = 16; // News
const PER_PAGE = 100;
const PAGE_LIMIT = 2;
let PAGE_COUNT = 1;
const DEFAULT_PARAMS = [
  `per_page=${PER_PAGE}`,
  `categories=${CATEGORIES}`,
  `categories_exclude=${EXCLUDED_CATEGORIES}`,
];

const getDefaultParams = (params: string[]) => {
  return params.join("&");
};

const getUrlWithParams = (
  url: string,
  timestamp?: string | null,
  page?: number | null
) => {
  const defaultParams = getDefaultParams(DEFAULT_PARAMS);
  return timestamp
    ? encodeURI(`${url}?${defaultParams}&after=${timestamp}`)
    : encodeURI(`${url}?${defaultParams}&page=${page}`);
};

const getTimestamp = async (): Promise<string | undefined> => {
  try {
    return "2021-07-21T03:00:24";
  } catch (e) {
    console.error(e);
  }
};

const getPosts = async (url: string): Promise<Scrape[] | undefined> => {
  try {
    const { data: scrapes } = await axios.get(url);
    return scrapes;
  } catch (e) {
    console.error(`Error getting posts from ${url}`);
    console.error(e);
  }
};

const scrapeAll = async (url: string): Promise<Scrape[] | undefined> => {
  try {
    const onePage = await getPosts(url);
    PAGE_COUNT++;
    if (onePage) {
      if (PAGE_COUNT <= PAGE_LIMIT) {
        const nextPageUrl = getUrlWithParams(API_ENDPOINT, null, PAGE_COUNT);
        const nextPage = await scrapeAll(nextPageUrl);
        if (nextPage) {
          return [...nextPage, ...onePage];
        }
      } else {
        return onePage;
      }
    }
  } catch (e) {
    console.error(`Error scraping page ${PAGE_COUNT}`);
    console.error(e);
  }
};

export const scrapeLatest = async (): Promise<Story[] | undefined> => {
  try {
    const timestamp = await getTimestamp();
    if (timestamp) {
      const url = getUrlWithParams(API_ENDPOINT, timestamp, null);
      const scrapes = await getPosts(url);
      if (scrapes) {
        return pruneScrapes(scrapes);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const seed = async (): Promise<Story[] | undefined> => {
  try {
    const url = getUrlWithParams(API_ENDPOINT, null, PAGE_COUNT);
    const scrapes = await scrapeAll(url);
    if (scrapes) {
      PAGE_COUNT = 1;
      return pruneScrapes(scrapes);
    }
  } catch (e) {
    console.error(e);
  }
};
