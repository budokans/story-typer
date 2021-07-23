import axios from "axios";

export const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";
const PAGE_LIMIT = 10;
const START_PAGE = 1;
const PER_PAGE = 100;

const getUrlWithParams = (url: string, page: number) => {
  const timestamp = "";
  return timestamp
    ? `${url}?after=${timestamp}`
    : `${url}?page=${page}&per_page=${PER_PAGE}`;
};

const getPosts = async (url: string): Promise<any[] | undefined> => {
  try {
    const { data } = await axios.get(url);
    return data;
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

export const scrape = async (): Promise<any[] | undefined> => {
  const url = getUrlWithParams(API_ENDPOINT, START_PAGE);
  const scrapes = await getPosts(url);
  return scrapes;
};
