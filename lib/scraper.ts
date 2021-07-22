import axios from "axios";

export const SCRAPE_URL = "http://fiftywordstories.com/category/stories/";

export const getHTML = async (url: string): Promise<void> => {
  try {
    const { data: html } = await axios.get(url);
    return html;
  } catch (error) {
    console.log(error);
  }
};
