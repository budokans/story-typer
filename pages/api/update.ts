import { NextApiRequest, NextApiResponse } from "next";
import { addLatestStories } from "scraper/getStories";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "GET") {
    try {
      const storiesCount = await addLatestStories();
      res.status(200).json({
        message: storiesCount
          ? `Successfully scraped ${storiesCount} stories`
          : "No new stories scraped",
      });
    } catch (e) {
      res.status(500).json({
        status: `Story scraping failed. See logs for info`,
      });
      console.log(e);
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method not allowed.");
  }
}
