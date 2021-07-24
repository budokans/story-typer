import axios from "axios";

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

const getPosts = async (
  url: string
): Promise<{ scrapes: any[]; scrapeCount: number } | undefined> => {
  try {
    const { data: scrapes } = await axios.get(url);
    const scrapeCount = scrapes.length;
    return { scrapes, scrapeCount };
  } catch (e) {
    console.error(`Error getting posts from ${url}`);
    console.error(e);
  }
};

const scrapeAll = async (
  url: string
): Promise<{ scrapes: any[]; scrapeCount: number } | undefined> => {
  try {
    const onePage = await getPosts(url);
    PAGE_COUNT++;
    if (onePage) {
      if (PAGE_COUNT <= PAGE_LIMIT) {
        const nextPageUrl = getUrlWithParams(API_ENDPOINT, null, PAGE_COUNT);
        const nextPage = await scrapeAll(nextPageUrl);
        if (nextPage) {
          const { scrapes: nextPageScrapes, scrapeCount: nextPageScrapeCount } =
            nextPage;
          return {
            scrapes: onePage.scrapes.concat(nextPageScrapes),
            scrapeCount: onePage.scrapeCount + nextPageScrapeCount,
          };
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

export const scrapeLatest = async (): Promise<
  { scrapes: any[]; scrapeCount: number } | undefined
> => {
  try {
    const timestamp = await getTimestamp();
    if (timestamp) {
      const url = getUrlWithParams(API_ENDPOINT, timestamp, null);
      return await getPosts(url);
    }
  } catch (e) {
    console.error(e);
  }
};

export const seed = async (): Promise<
  { scrapes: any[]; scrapeCount: number } | undefined
> => {
  try {
    const url = getUrlWithParams(API_ENDPOINT, null, PAGE_COUNT);
    const data = await scrapeAll(url);
    PAGE_COUNT = 1;
    return data;
  } catch (e) {
    console.error(e);
  }
};
