import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file uploads
  },
};

export default async function handler(req, res) {
  console.log("Upload API called");
  if (req.method === "POST") {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "File upload failed" });
      }

      if (!files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("File uploaded", files.file);
      console.log("File path", files.file[0].filepath);

      res.status(200).json({
        message: "File uploaded successfully",
        filePath: `${files.file[0].filepath}`, // Return relative path for the frontend
      });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
