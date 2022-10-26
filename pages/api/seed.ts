import { NextApiRequest, NextApiResponse } from "next";
import { seed } from "@/lib/getStories";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await seed();
    res
      .status(200)
      .json({ status: "Stories fetched and database seeding underway..." });
  } catch (e) {
    res.status(500).json({ status: `Database seeding failed. See logs.` });
    console.error(e);
  }
}
