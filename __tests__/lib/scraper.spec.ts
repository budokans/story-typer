import { testables } from "../../lib/scraper";
const { getParamsString, getScrapeLatestUrl, getPageUrl } = testables;

const DEFAULT_PARAMS = ["1", "2", "3"];
const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";
const PAGE_NUMBER = 10;

describe("getParamsString", () => {
  test("joins returns a string of DEFAULT_PARAMS elements joined with &", () => {
    const result = getParamsString(DEFAULT_PARAMS);
    expect(result).toEqual("1&2&3");
  });
});

describe("getScrapeLatestUrl", () => {
  test("returns a URL in the correct format for scraping stories after a given timestamp", () => {
    const timestamp = "2021-07-21T03:00:24";
    const URL = getScrapeLatestUrl(API_ENDPOINT, DEFAULT_PARAMS, timestamp);
    expect(URL).toEqual(
      "http://fiftywordstories.com/wp-json/wp/v2/posts?1&2&3&after=2021-07-21T03:00:24"
    );
  });
});

describe("getPageUrl", () => {
  test("returns a URL in the correct format for scraping a given page for stories", () => {
    const URL = getPageUrl(API_ENDPOINT, DEFAULT_PARAMS, PAGE_NUMBER);
    expect(URL).toEqual(
      "http://fiftywordstories.com/wp-json/wp/v2/posts?1&2&3&page=10"
    );
  });
});
