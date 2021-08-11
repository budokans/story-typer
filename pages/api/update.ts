import { NextApiRequest, NextApiResponse } from "next";
import { getLatestStories } from "@/lib/getStories";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const newStories = await getLatestStories();
    res.status(200).json({
      message: newStories
        ? `Successfully scraped ${newStories.length} stories`
        : "No new stories scraped",
    });
  } catch (e) {
    res.status(500).json({
      status: `Story scraping failed - ${e.message}. See logs for info`,
    });
    console.error(e);
  }
}
