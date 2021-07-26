import { testables } from "../../lib/formatScrapes";
const {
  prune,
  pruneScrapes,
  removeLineBreaks,
  removeDoubleDashes,
  formatText,
  formatScrape,
  formatScrapes,
} = testables;

/**
 * @jest-environment node
 */

describe("prune", () => {
  const scrape = {
    id: 9304,
    date: "2021-07-21T03:00:24",
    link: "http://fiftywordstories.com/wp-json/wp/v2/posts",
    title: { rendered: "some title " },
    content: { rendered: "some sample text" },
    anotherField: "some value",
  };

  test("returns a new object with correct properties", () => {
    const result = prune(scrape);
    expect(Object.keys(result).length).toEqual(7);
    expect(Object.keys(result)).toEqual([
      "id",
      "title",
      "authorBio",
      "content",
      "url",
      "dateScraped",
      "datePublished",
    ]);
    expect(Object.keys(result.content)).toEqual(["html", "text"]);
  });

  test("does not mutate passed object", () => {
    prune(scrape);
    expect(Object.keys(scrape).length).toEqual(6);
    expect(typeof scrape.id).toEqual("number");
  });
});
