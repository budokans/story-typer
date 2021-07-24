import * as entities from "entities";
import unidecode from "unidecode";
import { Scrape, Story } from "../interfaces";

const prune = (scrape: Scrape): Story => ({
  id: scrape.id.toString(),
  title: unidecode(entities.decodeHTML(scrape.title.rendered)),
  authorBio: scrape.content.rendered,
  content: {
    html: scrape.content.rendered,
    text: scrape.content.rendered,
  },
  url: scrape.link,
  dateScraped: new Date().toISOString(),
  datePublished: scrape.date,
});

export const pruneScrapes = (scrapes: Scrape[]): Story[] => {
  return scrapes.map(prune);
};

const formatText = (text: string) => {
  return unidecode(entities.decodeHTML(text.trim()));
};

const formatScrape = (scrape: Story): Story => ({
  id: scrape.id,
  title: formatText(scrape.title),
  authorBio: scrape.authorBio,
  content: {
    html: scrape.content.html,
    text: scrape.content.text,
  },
  url: scrape.url,
  dateScraped: scrape.dateScraped,
  datePublished: scrape.datePublished,
});

export const formatScrapes = (stories: Story[]): Story[] => {
  return stories.map(formatScrape);
};
