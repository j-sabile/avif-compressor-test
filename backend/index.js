import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import { Server } from "socket.io";
import { createServer } from "http";
import archiver from "archiver";
import { rimraf } from "rimraf";
import dotenv from "dotenv";

dotenv.config();
const ORIGIN = process.env.ORIGIN;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ORIGIN }));

const upload = multer();
app.get("/", (req, res) => res.send("HELLO WORLD"));

app.post("/image", upload.array("img"), async (req, res) => {
  const images = req.files;
  const quality = parseInt(req.body.quality);
  const effort = parseInt(req.body.effort);
  const resolution = parseInt(req.body.resolution);
  // const socketId = req.body.socketId;

  // fs.mkdirSync(`compressed/${socketId}`);
  const results = [];
  const promises = [];
  images.forEach((img) => results.push({ originalSize: img.size, newSize: 0 }));
  for (let [ind, img] of images.entries()) {
    promises.push(
      await sharp(img.buffer)
        .resize(resolution, resolution, { fit: "outside", withoutEnlargement: true })
        .avif({ effort, quality })
        .keepExif()
        .keepIccProfile()
        .toFile(`../Compressed Images/${img.originalname.substring(0, img.originalname.lastIndexOf("."))}.avif`)
        .then((res) => (results[ind].newSize = res.size))
    );
  }
  await Promise.all(promises);
  return res.status(200).json({ message: "Success", results });
  // const promises = images.map(async (img) => {
  //   results.push(await sharp(img.buffer)
  //     .resize(resolution, resolution, { fit: "outside", withoutEnlargement: true })
  //     .avif({ effort, quality })
  //     .keepExif()
  //     .keepIccProfile()
  //     .toFile(`../Compressed Images/${img.originalname.substring(0, img.originalname.lastIndexOf("."))}.avif`));
  //   // io.to(socketId).emit("compressed", img.originalname);
  // });
});

app.post("/download", (req, res) => {
  const socketId = req.body.socketId;
  const output = fs.createWriteStream(`./compressed/${socketId}.zip`);
  const archive = archiver("zip", { zlib: { level: 2 } });

  output.on("close", () => {
    console.log(`Compression complete ${socketId}. Archive size: ${(archive.pointer() / 1024 ** 2).toFixed(2)}MB`);
    res.setHeader("Content-Disposition", `attachment; filename=${socketId}.zip`);
    res.setHeader("Content-Type", "application/zip");
    res.download(`./compressed/${socketId}.zip`);

    rimraf(`./compressed/${socketId}.zip`);
    rimraf(`./compressed/${socketId}`);
  });

  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(output);
  archive.directory(`./compressed/${socketId}/`, false);
  archive.finalize();
});

// SOCKET.IO
const users = new Set();
const server = createServer(app);
const io = new Server(server, { cors: { origin: ORIGIN } });

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  users.add(String(socket.id));

  socket.on("disconnect", () => {
    users.delete(String(socket.id));
    console.log(`${socket.id} disconnected`);

    rimraf(`./compressed/${socket.id}.zip`);
    rimraf(`./compressed/${socket.id}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
