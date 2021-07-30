import axios from "axios";
import { testables } from "../../lib/getStories";
const {
  getParamsString,
  getLatestPostsUrl,
  getPageUrl,
  getPosts,
  getPostsOverPagesRecursive,
  getPostsOverPagesFactory,
  getPostsOverPages,
} = testables;

const DEFAULT_PARAMS = ["1", "2", "3"];
const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
afterAll(() => {
  jest.clearAllMocks();
});

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
    await expect(getPosts(API_ENDPOINT)).resolves.toStrictEqual(posts);
  });

  test("should throw if Promise is rejected", async () => {
    const errorMessage = "Network Error";
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );
    await expect(getPosts(API_ENDPOINT)).rejects.toThrow(errorMessage);
  });
});

describe("getPostsOverPages", () => {
  test("calls itself the correct number of times and with the correct URL", async () => {
    const getPostsOverPagesRecursiveSpy = jest.fn(getPostsOverPagesRecursive);
    const getPostsOverPages = getPostsOverPagesFactory(
      getPostsOverPagesRecursiveSpy
    );
    await getPostsOverPages(
      "http://fiftywordstories.com/wp-json/wp/v2/posts",
      1,
      5
    );
    expect(getPostsOverPagesRecursiveSpy).toHaveBeenCalledTimes(5);
  });

  test("combines the results from fetching data across multiple pages and returns them", async () => {
    const posts = [{ title: "Story Title" }];
    const result = await getPostsOverPages(
      "http://fiftywordstories.com/wp-json/wp/v2/posts",
      1,
      3
    );
    expect(result).toStrictEqual([...posts, ...posts, ...posts]);
  });
});
