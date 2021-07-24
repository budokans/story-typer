import { Scrape, Story } from "../interfaces";

export const prune = (scrape: Scrape): Story => ({
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

export const pruneScrapes = (scrapes: Scrape[]): Story[] => {
  return scrapes.map(prune);
};
