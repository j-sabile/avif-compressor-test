import multer from "multer";
import path from "path";
import fs from "fs";
import processImages from "./controllers/postImage.js";
import getExif from "./controllers/getExif.js";
import getMakeModelPresets from "./controllers/getMakeModelPresets.js";

const UPLOAD_ROOT = "tmp/";
const FIELD_FOLDERS = {
  image: "image",
  metadataImage: "metadata",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = FIELD_FOLDERS[file.fieldname];
    if (!subfolder) return cb(new Error(`Unexpected field ${file.fieldname}`));
    const dest = path.join(UPLOAD_ROOT, subfolder);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
const uploadBuffer = multer();

const router = (app) => {
  app.get("/", (_, res) => res.send("API HOME"));
  app.post(
    "/image",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "metadataImage", maxCount: 1 },
    ]),
    processImages
  );
  app.post("/exif", uploadBuffer.array("exif"), getExif);
  app.get("/make-model-presets", getMakeModelPresets);
};

export default router;
