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
  test("does not mutate passed object", () => {
    const obj = {
      id: 9304,
      date: "2021-07-21T03:00:24",
      link: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      title: { rendered: "some title " },
      content: { rendered: "some sample text" },
      anotherField: "some value",
    };

    const result = prune(obj);
    expect(Object.keys(result).length).toEqual(7);
    expect(Object.keys(obj).length).toEqual(6);
    expect(typeof obj.id).toEqual("number");
  });
});
