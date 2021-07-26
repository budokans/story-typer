import * as R from "ramda";
import * as entities from "entities";
import unidecode from "unidecode";
import { Scrape, Story } from "../interfaces";

const prune = (scrape: Scrape): Story => ({
  id: scrape.id.toString(),
  title: scrape.title.rendered,
  authorBio: scrape.content.rendered,
  content: {
    html: scrape.content.rendered,
    text: scrape.content.rendered,
  },
  url: scrape.link,
  dateScraped: new Date().toISOString(),
  datePublished: scrape.date,
});

const pruneScrapes = (scrapes: Scrape[]): Story[] => {
  return scrapes.map(prune);
};

const removeLineBreaks = (text: string): string => text.replace(/\n/g, " ");
const removeDoubleDashes = (text: string): string => text.replace(/--/g, " - ");

const formatText = R.pipe(
  R.trim,
  entities.decodeHTML,
  unidecode,
  removeLineBreaks,
  removeDoubleDashes
);

const formatScrape = (scrape: Story): Story => ({
  id: scrape.id,
  title: formatText(scrape.title),
  authorBio: formatText(scrape.authorBio),
  content: {
    html: scrape.content.html,
    text: scrape.content.text,
  },
  url: scrape.url,
  dateScraped: scrape.dateScraped,
  datePublished: scrape.datePublished,
});

const formatScrapes = (stories: Story[]): Story[] => {
  return stories.map(formatScrape);
};

export const testables = {
  prune,
  pruneScrapes,
  removeLineBreaks,
  removeDoubleDashes,
  formatText,
  formatScrape,
  formatScrapes,
};

export const formatStories = R.pipe(pruneScrapes, formatScrapes);
