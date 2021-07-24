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
    return "";
  } catch (error) {
    console.log(error);
  }
};

const getPosts = async (
  url: string
): Promise<{ scrapes: any[]; scrapeCount: number } | undefined> => {
  try {
    const { data: scrapes } = await axios.get(url);
    const scrapeCount = scrapes.length;
    return { scrapes, scrapeCount };
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
};

const scrapeAll = async (
  url: string
): Promise<{ scrapes: any[]; scrapeCount: number } | undefined> => {
  try {
    PAGE_COUNT++;
    const onePage = await getPosts(url);
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
  } catch (error) {
    console.log(`Error scraping page ${PAGE_COUNT}`);
  }
};

export const scrapeLatest = async (): Promise<
  { scrapes: any[]; scrapeCount: number } | undefined
> => {
  try {
    const timestamp = await getTimestamp();
    if (timestamp) {
      const url = getUrlWithParams(API_ENDPOINT, timestamp, null);
      const data = await getPosts(url);
      if (data) {
        const { scrapes, scrapeCount } = data;
        return { scrapes, scrapeCount };
      } else {
        return;
      }
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export const seed = async (): Promise<
  { scrapes: any[]; scrapeCount: number } | undefined
> => {
  try {
    const url = getUrlWithParams(API_ENDPOINT, null, PAGE_COUNT);
    const data = await scrapeAll(url);
    if (data) {
      PAGE_COUNT = 1;
      const { scrapes, scrapeCount } = data;
      return { scrapes, scrapeCount };
    }
  } catch (error) {
    console.log(error);
  }
};
