import { formatStories } from "../../lib/formatScrapes";
import { testables } from "../../lib/formatScrapes";
const {
  checkBioExists,
  getBio,
  prune,
  removeLineBreaks,
  removeDoubleDashes,
  removeHtmlTags,
  formatText,
  formatScrape,
} = testables;

/**
 * @jest-environment node
 */

describe("checkBioExists", () => {
  test("takes a string containing HTML and returns true if a bio is present", () => {
    const sampleString =
      '<p>They take so many photos. Hold it up, down, wave it about! Nancy! Over here! Smile! A purple balloon, shiny as a sixpence, more beautiful than she has ever seen. She holds tight onto its string and the decades float away. She is six. She is happy. There is cake.</p>\n<hr>\n<p>Marie writes poetry and flash fiction and plays with writing prompts on Twitter at <a href="https://twitter.com/jamsaucer" rel="noopener" target="_blank">@jamsaucer</a>.</p>';
    expect(checkBioExists(sampleString)).toEqual(true);
  });

  test("takes a string containing HTML and returns false if a bio is not present", () => {
    const sampleString = "<p>No hr element so no bio here";
    expect(checkBioExists(sampleString)).toEqual(false);
  });
});

describe("getBio", () => {
  test("returns a 'sorry' message if no bio exists", () => {
    const sampleString = "<p>No hr element so no bio here";
    expect(getBio(sampleString)).toEqual(
      "Sorry, we couldn't find a bio for this author."
    );
  });
});

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

describe("removeHtmlTags", () => {
  test("takes a string and returns a new string with any HTML tags removed", () => {
    const sampleString =
      '<em>The Twin Bill</em>. Follow him on Twitter at <a href="https://twitter.com/jonsfain" rel="noopener" target="_blank">@jonsfain</a>.';
    const expectedResult = "The Twin Bill. Follow him on Twitter at @jonsfain.";
    const result = removeHtmlTags(sampleString);
    expect(result).toEqual(expectedResult);
  });
});

describe("formatText", () => {
  test("takes a string and returns a trimmed string that is typeable without using alt codes", () => {
    const sampleString =
      "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor&#8217;s dream, but a story enthusiast&#8217;s nightmare.</p>\n<p>By telling perusers nothing—despite showing plenty—the disjointed narrative…";
    const expected =
      "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare.</p> <p>By telling perusers nothing - despite showing plenty - the disjointed narrative...";
    const formatted = formatText(sampleString);
    expect(formatted).toEqual(expected);
  });
});

describe("formatScrape", () => {
  test("takes an unformatted, pruned scrape and returns a formatted scrape", () => {
    const prunedScrape = {
      title: "JOHN H. DROMEY: I Can&#8217;t Even Tell You the Title",
      authorBio:
        "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor&#8217;s dream, but a story enthusiast&#8217;s nightmare.</p>\n<p>By telling perusers nothing—despite showing plenty—the disjointed narrative",
      content: {
        html: "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor&#8217;s dream, but a story enthusiast&#8217;s nightmare.</p>\n<p>By telling perusers nothing—despite showing plenty—the disjointed narrative",
        text: "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor&#8217;s dream, but a story enthusiast&#8217;s nightmare.</p>\n<p>By telling perusers nothing—despite showing plenty—the disjointed narrative",
      },
      url: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      datePublished: "2021-07-21T03:00:24",
    };

    const expectedOutput = {
      title: "JOHN H. DROMEY: I Can't Even Tell You the Title",
      authorBio:
        "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare.</p> <p>By telling perusers nothing - despite showing plenty - the disjointed narrative",
      content: {
        html: "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare.</p> <p>By telling perusers nothing - despite showing plenty - the disjointed narrative",
        text: "Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare. By telling perusers nothing - despite showing plenty - the disjointed narrative",
      },
      url: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      datePublished: "2021-07-21T03:00:24",
    };

    const result = formatScrape(prunedScrape);
    expect(result).toEqual(expectedOutput);
  });
});

describe("formatStories", () => {
  test("takes raw scrapes and returns formatted stories", () => {
    const scrape = {
      date: "2021-07-21T03:00:24",
      link: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      title: {
        rendered: "JOHN H. DROMEY: I Can&#8217;t Even Tell You the Title",
      },
      content: {
        rendered:
          "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor&#8217;s dream, but a story enthusiast&#8217;s nightmare.</p>\n<p>By telling perusers nothing—despite showing plenty—the disjointed narrative",
      },
      shouldNotBeInReturnedObj: "foo",
    };

    const scrapesArr = Array(5);
    scrapesArr.fill(scrape);

    const expectedOutputStory = {
      title: "JOHN H. DROMEY: I Can't Even Tell You the Title",
      authorBio:
        "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare.</p> <p>By telling perusers nothing - despite showing plenty - the disjointed narrative",
      content: {
        html: "<p>Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare.</p> <p>By telling perusers nothing - despite showing plenty - the disjointed narrative",
        text: "Anon essayed a purely descriptive tale. The result? A formulaic editor's dream, but a story enthusiast's nightmare. By telling perusers nothing - despite showing plenty - the disjointed narrative",
      },
      url: "http://fiftywordstories.com/wp-json/wp/v2/posts",
      datePublished: "2021-07-21T03:00:24",
    };

    const outputArr = Array(5);
    outputArr.fill(expectedOutputStory);

    const result = formatStories(scrapesArr);
    expect(result).toEqual(outputArr);
  });
});
