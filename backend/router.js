import multer from "multer";
import processImages from "./controllers/postImage.js";
import getExif from "./controllers/getExif.js";

const upload = multer();

const router = (app) => {
  app.get("/", (_, res) => res.send("API HOME"));
  app.post("/image", upload.array("img"), processImages);
  app.post("/exif", upload.array("img"), getExif)
};

export default router;
