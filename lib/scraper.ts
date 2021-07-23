import axios from "axios";

export const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";
const PAGE_LIMIT = 1;
const PER_PAGE = 100;
let PAGE_COUNT = 1;

const getUrlWithParams = (url: string, page: number) => {
  return `${url}?page=${page}&per_page=${PER_PAGE}&categories=112&categories_exclude=16`;
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
      if (PAGE_COUNT < PAGE_LIMIT) {
        const nextPageUrl = getUrlWithParams(API_ENDPOINT, PAGE_COUNT);
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
      const data = await scrapeLatest(
        `${API_ENDPOINT}?per_page=${PER_PAGE}&categories=112&categories_exclude=16&after=${timestamp}`
      );
      if (data) {
        const { scrapes, scrapeCount } = data;
        return { scrapes, scrapeCount };
      }
    } else {
      const url = getUrlWithParams(API_ENDPOINT, PAGE_COUNT);
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
