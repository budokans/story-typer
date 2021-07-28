import { formatStories } from "../../lib/formatScrapes";
import { testables } from "../../lib/formatScrapes";
const {
  checkBioExists,
  getHrElement,
  getStartIndex,
  getBio,
  getStory,
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
  test("returns the index in the string of the character immediately following the end of the boundary", () => {
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

  test("returns a the bio if the bio exists", () => {
    const sampleString =
      "/p>\n<hr>\n<p>Edward Mcinnis wrote this story.</p>\n<div class=";
    const result = getBio(sampleString);
    const expected = "\n<p>Edward Mcinnis wrote this story.</p>\n";
    expect(result).toEqual(expected);
  });
});

describe("getStory", () => {
  test("returns only the portion of the html string that corresponds to the story", () => {
    const stringWithHr =
      '<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n<hr>\n<p>Edward Mcinnis wrote this story.</p>\n<div class="likebtn_container" style="">';
    const expectedWithHr =
      "<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n";
    const resultWithHr = getStory(stringWithHr);
    expect(resultWithHr).toEqual(expectedWithHr);

    const stringWithoutHr =
      '<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n<div class="likebtn_container" style="">';
    const expectedWithoutHr =
      "<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n";
    const resultWithoutHr = getStory(stringWithoutHr);
    expect(resultWithoutHr).toEqual(expectedWithoutHr);
  });
});

describe("prune", () => {
  const scrape = {
    date: "2021-07-21T03:00:24",
    link: "http://fiftywordstories.com/wp-json/wp/v2/posts",
    title: { rendered: "some title" },
    content: {
      rendered:
        '<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n<hr>\n<p>Edward Mcinnis wrote this story.</p>\n<div class="likebtn_container" style="">',
    },
    shouldNotBeInReturnedObj: "some value",
  };

  const expectedOutput = {
    title: "some title",
    authorBio: "\n<p>Edward Mcinnis wrote this story.</p>\n",
    content: {
      html: "<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n",
      text: "<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n",
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
          '<p>My friend, in his early 70&#8217;s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin&#8217; to get an iced tea. He said to the teenaged server, &#8220;It&#8217;s going to be 98 today.&#8221;</p>\n<p>&#8220;Oh!&#8221; she said brightly. &#8220;Happy birthday!&#8221;</p>\n<hr>\n<p>Edward Mcinnis wrote this story.</p>\n<div class="likebtn_container" style="">',
      },
      shouldNotBeInReturnedObj: "foo",
    };

    const scrapesArr = Array(5);
    scrapesArr.fill(scrape);

    const expectedOutputStory = {
      title: "JOHN H. DROMEY: I Can't Even Tell You the Title",
      authorBio: "<p>Edward Mcinnis wrote this story.</p>",
      content: {
        html: '<p>My friend, in his early 70\'s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin\' to get an iced tea. He said to the teenaged server, "It\'s going to be 98 today."</p> <p>"Oh!" she said brightly. "Happy birthday!"</p>',
        text: 'My friend, in his early 70\'s, was out and about doing errands during the most recent brutal heat wave. Dying from the heat, he stopped at Dunkin\' to get an iced tea. He said to the teenaged server, "It\'s going to be 98 today." "Oh!" she said brightly. "Happy birthday!"',
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
