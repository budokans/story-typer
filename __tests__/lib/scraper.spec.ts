import axios from "axios";
import { testables } from "../../lib/scraper";
const { getParamsString, getLatestPostsUrl, getPageUrl, getPosts } = testables;

const DEFAULT_PARAMS = ["1", "2", "3"];
const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getParamsString", () => {
  test("joins returns a string of DEFAULT_PARAMS elements joined with &", () => {
    const result = getParamsString(DEFAULT_PARAMS);
    expect(result).toEqual("1&2&3");
  });
});

describe("getLatestPostsUrl", () => {
  test("returns a URL in the correct format to GET posts after a given timestamp", () => {
    const timestamp = "2021-07-21T03:00:24";
    const URL = getLatestPostsUrl(API_ENDPOINT, DEFAULT_PARAMS, timestamp);
    expect(URL).toEqual(
      "http://fiftywordstories.com/wp-json/wp/v2/posts?1&2&3&after=2021-07-21T03:00:24"
    );
  });
});

describe("getPageUrl", () => {
  test("returns a URL in the correct format to GET a given page of posts", () => {
    const pageNum = 10;
    const URL = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS, pageNum);
    expect(URL).toEqual(
      "http://fiftywordstories.com/wp-json/wp/v2/posts?1&2&3&page=10"
    );
  });
});

describe("getPosts", () => {
  test("should fetch and return posts", async () => {
    const posts = [{ title: "Story Title" }];
    const response = { data: posts };
    mockedAxios.get.mockImplementation(() => Promise.resolve(response));

    const result = await getPosts(API_ENDPOINT);
    expect(result).toEqual(posts);
  });
});
