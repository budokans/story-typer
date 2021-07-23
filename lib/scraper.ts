import axios from "axios";

export const API_ENDPOINT = "http://fiftywordstories.com/wp-json/wp/v2/posts";

export const getHTML = async (url: string): Promise<void> => {
  try {
    const { data: html } = await axios.get(url);
    return html;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
};
