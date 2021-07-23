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

const getDefaultParams = () => {
  return DEFAULT_PARAMS.join("&");
};

const getUrlWithParams = (
  url: string,
  timestamp?: string | null,
  page?: number | null
) => {
  const defaultParams = getDefaultParams();
  return timestamp
    ? encodeURI(`${url}?${defaultParams}&after=${timestamp}`)
    : encodeURI(`${url}?${defaultParams}&page=${page}`);
};

const getTimestamp = () => {
  return "";
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

const scrapeLatest = async (url: string) => {
  return getPosts(url);
};

export const scrape = async (): Promise<
  { scrapes: any[]; scrapeCount: number } | undefined
> => {
  const timestamp = getTimestamp();

  try {
    if (timestamp) {
      const url = getUrlWithParams(API_ENDPOINT, timestamp, null);
      const data = await scrapeLatest(url);
      if (data) {
        const { scrapes, scrapeCount } = data;
        return { scrapes, scrapeCount };
      }
    } else {
      const url = getUrlWithParams(API_ENDPOINT, null, PAGE_COUNT);
      const data = await scrapeAll(url);
      if (data) {
        const { scrapes, scrapeCount } = data;
        PAGE_COUNT = 1;
        return { scrapes, scrapeCount };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
