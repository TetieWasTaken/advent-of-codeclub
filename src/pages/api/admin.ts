import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const { searchParams } = new URL(
        `http://${process.env.HOST ?? "localhost"}${req.url}`,
      );

      const base64Id = searchParams.get("id");

      if (!base64Id) {
        res.status(400).json({ error: "Missing id" });
        return;
      }

      const id = atob(base64Id);

      if (id == process.env.ADMIN_ID) {
        res.status(200).json({ isAdmin: true });
      } else {
        res.status(403).json({ isAdmin: false });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.warn("Error uploading file to storage");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
