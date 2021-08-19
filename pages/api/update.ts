import { NextApiRequest, NextApiResponse } from "next";
import { addLatestStories } from "@/lib/getStories";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const storiesCount = await addLatestStories();
    res.status(200).json({
      message: storiesCount
        ? `Successfully scraped ${storiesCount} stories`
        : "No new stories scraped",
    });
  } catch (e) {
    res.status(500).json({
      status: `Story scraping failed - ${e.message}. See logs for info`,
    });
    console.error(e);
  }
}
