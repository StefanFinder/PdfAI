import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Import multer
import chat from "./chat.js";

// cors: a middleware to help resolve cross domain issue

// now we can use the .env file
dotenv.config();

const app = express();
app.use(cors());

// Configure multer
const storage = multer.diskStorage({
  // where to store the file that we upload
  // here we defined the path to store: /server/uploads
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// multer: used to upload file
const upload = multer({ storage: storage });

const PORT = 5001;

let filePath;

// here, upload is our multer. the variable is file. value is the doc to upload
// here we use the multer as the middleware, it will automatically store the file
app.post("/upload", upload.single("file"), async (req, res) => {
  // Use multer to handle file upload
  filePath = req.file.path; // The path where the file is temporarily saved
  res.send(filePath + " upload successfully.");
});

app.get("/chat", async (req, res) => {
  const resp = await chat(filePath, req.query.question); // Pass the file path to your main function
  res.send(resp.text);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
