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

app.post("/image", upload.array("img"), async (req, res) => {
  const images = req.files;
  const { quality, effort } = req.body;

  const promises = images.map(async (img) => {
    await sharp(img.buffer)
      .resize(360, 360, { fit: "outside" })
      .avif({ effort: parseInt(effort), quality: parseInt(quality) })
      .toFile(`../Compressed Images/${img.originalname.substring(0, img.originalname.lastIndexOf("."))}.avif`);
  });

  await Promise.all(promises);
  res.status(200).json({ message: "Success" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
