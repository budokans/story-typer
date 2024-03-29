import * as R from "ramda";
import * as entities from "entities";
import unidecode from "unidecode";
import { Post, Posts, ScrapedStory, ScrapedStories } from "./types";

const checkBioExists = (text: string): boolean => text.includes("<hr");

const getHrElement = (text: string): string | null => {
  const match = text.match(/<hr\s?\/?>/);
  return match && match.length >= 1 ? match[0]! : null;
};

const getStartIndex = (text: string, boundary: string): number =>
  text.indexOf(boundary) + boundary.length;

const getBio = (text: string): string => {
  const hrElement = getHrElement(text);
  return hrElement
    ? text.slice(getStartIndex(text, hrElement), text.indexOf("<div"))
    : "Sorry, we couldn't find a bio for this author.";
};

const getStory = (text: string): string => {
  const hrElement = getHrElement(text);
  return hrElement
    ? text.slice(0, text.indexOf(hrElement))
    : text.slice(0, text.indexOf("<div"));
};

const prune = (post: Post): ScrapedStory => ({
  title: post.title.rendered,
  authorBio: getBio(post.content.rendered),
  storyHtml: getStory(post.content.rendered),
  storyText: getStory(post.content.rendered),
  url: post.link,
  datePublished: post.date,
});

const prunePosts = (posts: Posts): ScrapedStories => {
  return posts.map(prune);
};

const removeLineBreaks = (text: string): string => text.replace(/\n/g, " ");
const removeDoubleDashes = (text: string): string => text.replace(/--/g, " - ");
const removeHtmlTags = (text: string): string => text.replace(/<.+?>/g, "");
const replaceMultiSpaces = (text: string): string =>
  text.replace(/\s{2,}/g, " ");

const formatText = R.pipe(
  R.trim,
  entities.decodeHTML,
  unidecode,
  removeLineBreaks,
  removeDoubleDashes
);

const formatStory = (story: ScrapedStory): ScrapedStory => ({
  title: formatText(story.title),
  authorBio: formatText(story.authorBio),
  storyHtml: formatText(story.storyHtml),
  storyText: R.pipe(
    removeHtmlTags,
    replaceMultiSpaces,
    formatText
  )(story.storyText),
  url: story.url,
  datePublished: story.datePublished,
});

const formatPosts = (stories: ScrapedStories): ScrapedStories => {
  return stories.map(formatStory);
};

export const testables = {
  checkBioExists,
  getHrElement,
  getStartIndex,
  getBio,
  getStory,
  prune,
  removeLineBreaks,
  removeDoubleDashes,
  removeHtmlTags,
  replaceMultiSpaces,
  formatText,
  formatStory,
};

export const formatStories = R.pipe(prunePosts, formatPosts);
