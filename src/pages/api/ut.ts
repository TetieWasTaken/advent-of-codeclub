import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { uid } = req.body;

    if (!uid) {
      res.status(400).json({ error: "Missing uid" });
      return;
    }

    try {
      const key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

      if (!key) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      const token = jwt.sign({ uid, purpose: "upload" }, key, {
        expiresIn: "30s",
      });

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
