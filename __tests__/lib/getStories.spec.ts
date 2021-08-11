import axios from "axios";
import { testables, getLatestStories } from "@/lib/getStories";
const {
  getParamsString,
  getLatestPostsUrl,
  getPageUrl,
  getPosts,
  getPostsOverPagesRecursive,
  getPostsOverPagesFactory,
  getPostsOverPages,
} = testables;

/**
 * @jest-environment node
 */

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

  test("returns a URL in the correct format with no 3rd argument passed", () => {
    const URL = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS);
    expect(URL).toEqual(
      "http://fiftywordstories.com/wp-json/wp/v2/posts?1&2&3&page=1"
    );
  });
});

describe("getPosts", () => {
  test("should fetch and return posts", async () => {
    const posts = [{ title: "Story Title" }];
    const response = { data: posts };
    mockedAxios.get.mockResolvedValue(response);
    await expect(getPosts(API_ENDPOINT)).resolves.toStrictEqual(posts);
  });

  test("should throw if Promise is rejected", async () => {
    const errorMessage = "Network Error";
    mockedAxios.get.mockRejectedValueOnce(errorMessage);

    await expect(getPosts(API_ENDPOINT)).rejects.toEqual(errorMessage);
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

describe("getLatestStories", () => {
  test("returns fully formatted stories", () => {
    const post = {
      date: "2021-07-21T03:00:24",
      link: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      title: {
        rendered: "JOHN H. DROMEY: I Can&#8217;t Even Tell You the Title",
      },
      content: {
        rendered:
          '<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n<hr>\n<p>Edward Mcinnis wrote this story.</p>\n<div class="likebtn_container" style="">',
      },
      shouldNotBeInReturnedObj: "foo",
    };
    const posts = Array(5).fill(post);
    const response = { data: posts };
    mockedAxios.get.mockResolvedValueOnce(response);

    const expectedOutputStory = {
      title: "JOHN H. DROMEY: I Can't Even Tell You the Title",
      authorBio: "<p>Edward Mcinnis wrote this story.</p>",
      storyHtml:
        '<p>My friend, in his early 70\'s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin\' to get an iced tea. He said to the teenaged server, "It\'s going to be 98 today."</p> <p>"Oh!" she said brightly. "Happy birthday!"</p>',
      storyText:
        'My friend, in his early 70\'s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin\' to get an iced tea. He said to the teenaged server, "It\'s going to be 98 today." "Oh!" she said brightly. "Happy birthday!"',

      url: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      datePublished: "2021-07-21T03:00:24",
    };
    const outputArr = Array(5).fill(expectedOutputStory);
    expect(getLatestStories()).resolves.toStrictEqual(outputArr);
  });

  test("returns with a Promise resolved to undefined if invalid data is returned from the API call", () => {
    const response = { status: 500 };
    mockedAxios.get.mockResolvedValueOnce(response);
    expect(getLatestStories()).resolves.toEqual(undefined);
  });
});
