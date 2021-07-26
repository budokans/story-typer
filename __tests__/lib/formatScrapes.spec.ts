import { testables } from "../../lib/formatScrapes";
const {
  prune,
  removeLineBreaks,
  removeDoubleDashes,
  formatText,
  formatScrape,
} = testables;

/**
 * @jest-environment node
 */

describe("prune", () => {
  const scrape = {
    id: 9304,
    date: "2021-07-21T03:00:24",
    link: "http://fiftywordstories.com/wp-json/wp/v2/posts",
    title: { rendered: "some title" },
    content: { rendered: "some sample text" },
    shouldNotBeInReturnedObj: "some value",
  };

  test("takes a scrape and produces a pruned scrape with the correct properties and values", () => {
    const pruned = prune(scrape);
    expect(pruned.id).toEqual(9304);
    expect(pruned.title).toEqual("some title");
    expect(pruned.authorBio).toEqual("some sample text");
    expect(pruned.content.html).toEqual("some sample text");
    expect(pruned.content.text).toEqual("some sample text");
    expect(pruned.url).toEqual(
      "http://fiftywordstories.com/wp-json/wp/v2/posts"
    );
    expect(pruned.datePublished).toEqual("2021-07-21T03:00:24");
  });
});

describe("removeLineBreaks", () => {
  test("replaces any line breaks in the input string with a space", () => {
    const sampleString =
      "\n<p>With no explication whatsoever, readers could only wonder what it was all about.</p>\n<hr>\n<p>";
    const result = removeLineBreaks(sampleString);
    expect(result).toEqual(
      " <p>With no explication whatsoever, readers could only wonder what it was all about.</p> <hr> <p>"
    );
  });
});

describe("removeDoubleDashes", () => {
  test("replaces '--' in the input string with ' - ' and returns the new string", () => {
    const sampleString = "Yes--I mean no--I mean yes!";
    const result = removeDoubleDashes(sampleString);
    expect(result).toEqual("Yes - I mean no - I mean yes!");
  });
});

describe("formatText", () => {
  test("takes a string and returns a trimmed string that is typeable without using alt codes", () => {
    const sampleString =
      "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor&#8217;s dream, but a story enthusiast&#8217;s nightmare.</p>\n<p>By telling perusers nothing—despite showing plenty—the disjointed narrative";
    const expected =
      "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare.</p> <p>By telling perusers nothing - despite showing plenty - the disjointed narrative";
    const formatted = formatText(sampleString);
    expect(formatted).toEqual(expected);
  });
});
