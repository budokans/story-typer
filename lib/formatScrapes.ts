import * as R from "ramda";
import * as entities from "entities";
import unidecode from "unidecode";
import { Scrape, Story } from "../interfaces";

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
  prune,
  removeLineBreaks,
  removeDoubleDashes,
  removeHtmlTags,
  formatText,
  formatScrape,
};

export const formatStories = R.pipe(pruneScrapes, formatScrapes);
