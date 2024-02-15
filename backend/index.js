import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import { Server } from "socket.io";
import { createServer } from "http";

const ORIGIN = "http://localhost:5173";

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
  const socketId = req.body.socketId;

  const promises = images.map(async (img) => {
    await sharp(img.buffer)
      .resize(resolution, resolution, { fit: "outside", withoutEnlargement: true })
      .avif({ effort, quality })
      .keepExif()
      .keepIccProfile()
      .toFile(`../Compressed Images/${img.originalname.substring(0, img.originalname.lastIndexOf("."))}.avif`);
    io.to(socketId).emit("compressed", img.originalname);
  });

  await Promise.all(promises);
  res.status(200).json({ message: "Success" });
});

app.post("/download", (req, res) => {});

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
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
