import { NextApiRequest, NextApiResponse } from "next";
import { addLatestStories } from "@/lib/getStories";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      if (authorization === `Bearer ${process.env.API_ACCESS_TOKEN}`) {
        const storiesCount = await addLatestStories();
        res.status(200).json({
          message: storiesCount
            ? `Successfully scraped ${storiesCount} stories`
            : "No new stories scraped",
        });
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (e: any) {
      res.status(500).json({
        status: `Story scraping failed - ${e.message}. See logs for info`,
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed.");
  }
}
