import { formatStories } from "../../lib/formatScrapes";
import { testables } from "../../lib/formatScrapes";
const {
  checkBioExists,
  getHrElement,
  getStartIndex,
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
  test("takes a string containing HTML and returns true if an <hr> is present", () => {
    const sampleString = "</p>\n<hr>\n<p>Marie writes poetry";
    expect(checkBioExists(sampleString)).toEqual(true);
  });

  test("takes a string containing HTML and returns true if an <hr /> is present", () => {
    const sampleString = "</p>\n<hr />\n<p>Marie writes poetry";
    expect(checkBioExists(sampleString)).toEqual(true);
  });

  test("takes a string containing HTML and returns false if a bio is not present", () => {
    const sampleString = "<p>No hr element so no bio here";
    expect(checkBioExists(sampleString)).toEqual(false);
  });
});

describe("getHrElement", () => {
  test("takes a string containing an hr and returns the hr element in its exact form", () => {
    const sampleStrings = [
      "</p>\n<hr>\n<p>Marie writes poetry",
      "</p>\n<hr/>\n<p>Marie writes poetry",
      "</p>\n<hr />\n<p>Marie writes poetry",
    ];

    const results = sampleStrings.map(getHrElement);
    expect(results[0]).toEqual("<hr>");
    expect(results[1]).toEqual("<hr/>");
    expect(results[2]).toEqual("<hr />");
  });
});

describe("getStartIndex", () => {
  test("return the index in the string of the character immediately following the end of the boundary", () => {
    const case1 = ["</p>\n<hr>\n<p>Marie writes poetry", "<hr>"];
    const case2 = ["</p>\n<hr/>\n<p>Marie writes poetry", "<hr/>"];
    const case3 = ["</p>\n<hr />\n<p>Marie writes poetry", "<hr />"];
    expect(getStartIndex(case1[0], case1[1])).toEqual(9);
    expect(getStartIndex(case2[0], case2[1])).toEqual(10);
    expect(getStartIndex(case3[0], case3[1])).toEqual(11);
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
