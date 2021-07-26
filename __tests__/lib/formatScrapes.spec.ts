import { testables } from "../../lib/formatScrapes";
const {
  prune,
  addTimestamp,
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
    date: "2021-07-21T03:00:24",
    link: "http://fiftywordstories.com/wp-json/wp/v2/posts",
    title: { rendered: "some title" },
    content: { rendered: "some sample text" },
    shouldNotBeInReturnedObj: "some value",
  };

  const expectedOutput = {
    title: "some title",
    authorBio: "some sample text",
    content: {
      html: "some sample text",
      text: "some sample text",
    },
    url: "http://fiftywordstories.com/wp-json/wp/v2/posts",
    datePublished: "2021-07-21T03:00:24",
  };

  test("takes a scrape and produces a pruned scrape with the correct properties and values", () => {
    const pruned = prune(scrape);
    expect(pruned).toEqual(expectedOutput);
  });
});

describe("addTimeStamp", () => {
  test("takes and object and returns a new object that is the same except for a dateScraped property", () => {
    const prunedScrape = {
      title: "title",
      authorBio: "bio",
      content: {
        html: "html",
        text: "text",
      },
      url: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      datePublished: "2021-07-21T03:00:24",
    };

    const dateAdded = addTimestamp(prunedScrape);
    expect(dateAdded).toHaveProperty("dateScraped");
    const re =
      /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3}[A-Z]{1})$/;
    expect(re.test(dateAdded.dateScraped)).toEqual(true);
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
