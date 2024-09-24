import processImages from "./controllers/postImage.js";
import multer from "multer";

const upload = multer();

const router = (app) => {
  app.get("/", (_, res) => res.send("API HOME"));
  app.post("/image", upload.array("img"), processImages);
};

export default router;
