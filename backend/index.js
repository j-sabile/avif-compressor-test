import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const upload = multer();

app.get("/", (req, res) => res.send("HELLO WORLD"));

app.post("/image", upload.single("img"), async (req, res) => {
  const image = req.file.buffer;
  await sharp(image)
    .resize(360, 360, { fit: "outside" })
    .avif({ effort: 0 })
    .toFile("test.avif");
  res.status(200).json({ message: "Success" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
