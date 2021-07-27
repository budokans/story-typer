import * as R from "ramda";
import * as entities from "entities";
import unidecode from "unidecode";
import { Scrape, Story } from "../interfaces";

const checkBioExists = (text: string): boolean => text.includes("<hr");
const getHrElement = (text: string): string | null => {
  const match = text.match(/<hr\s?\/?>/);
  return match ? match[0] : null;
};
const getStartIndex = (text: string, boundary: string): number =>
  text.indexOf(boundary) + boundary.length;

const getBio = (text: string): string => {
  return checkBioExists(text)
    ? "Bio found"
    : "Sorry, we couldn't find a bio for this author.";
};

const prune = (scrape: Scrape): Story => ({
  title: scrape.title.rendered,
  authorBio: scrape.content.rendered,
  content: {
    html: scrape.content.rendered,
    text: scrape.content.rendered,
  },
  url: scrape.link,
  datePublished: scrape.date,
});

const pruneScrapes = (scrapes: Scrape[]): Story[] => {
  return scrapes.map(prune);
};

const removeLineBreaks = (text: string): string => text.replace(/\n/g, " ");
const removeDoubleDashes = (text: string): string => text.replace(/--/g, " - ");
const removeHtmlTags = (text: string): string => text.replace(/<.+?>/g, "");

const formatText = R.pipe(
  R.trim,
  entities.decodeHTML,
  unidecode,
  removeLineBreaks,
  removeDoubleDashes
);

const formatScrape = (scrape: Story): Story => ({
  title: formatText(scrape.title),
  authorBio: formatText(scrape.authorBio),
  content: {
    html: formatText(scrape.content.html),
    text: removeHtmlTags(formatText(scrape.content.text)),
  },
  url: scrape.url,
  datePublished: scrape.datePublished,
});

const formatScrapes = (stories: Story[]): Story[] => {
  return stories.map(formatScrape);
};

export const testables = {
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
};

export const formatStories = R.pipe(pruneScrapes, formatScrapes);
