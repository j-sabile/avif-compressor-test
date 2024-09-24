// import multer from "multer";
// import sharp from "sharp";
// import fs from "fs";
// import { Server } from "socket.io";
// import archiver from "archiver";
// import { rimraf } from "rimraf";
// import { exec, execSync } from "child_process";

// app.post("/image/exif", upload.array("img"), async (req, res) => {
//     const orie = ["Horizontal (normal)", "Rotate 90 CW", "Rotate 180", "Rotate 270 CW", "Mirror horizontal", "Mirror vertical", "Mirror horizontal and rotate 270 CW", "Mirror horizontal and rotate 90 CW"];
  
//     const images = req.files;
//     const { brand, model } = req.body;
//     // console.log(images);
//     images.forEach((img) => {
//       fs.writeFile(img.originalname, img.buffer, () => {});
//       // const command = 'ex.exe "${img.originalname}" -Make="${brand}" -Model="${model}" -DateTimeOriginal="2022:12:25 02:00:00" -ExposureTime="1/125" -FNumber=5.6 -ISO=400 -FocalLength=50 -OffsetTimeOriginal="+08:00" -Orientation="${orie[0]}'; // Replace with the desired command
//       const command = `ex.exe "${img.originalname}" -overwrite_original -Make="${brand}" -Model="${model}" -OffsetTimeOriginal="+08:00"`;
//       exec(command, (error, stdout) => {
//         if (error) console.error(`exec error: ${error}`);
//         else console.log(stdout.trim());
//       });
//     });
//     res.status(200).json({ message: "Success" });
//   });
  
//   app.post("/download", (req, res) => {
//     const socketId = req.body.socketId;
//     const output = fs.createWriteStream(`./compressed/${socketId}.zip`);
//     const archive = archiver("zip", { zlib: { level: 2 } });
  
//     output.on("close", () => {
//       console.log(`Compression complete ${socketId}. Archive size: ${(archive.pointer() / 1024 ** 2).toFixed(2)}MB`);
//       res.setHeader("Content-Disposition", `attachment; filename=${socketId}.zip`);
//       res.setHeader("Content-Type", "application/zip");
//       res.download(`./compressed/${socketId}.zip`);
  
//       rimraf(`./compressed/${socketId}.zip`);
//       rimraf(`./compressed/${socketId}`);
//     });
  
//     archive.on("error", (err) => {
//       res.status(500).send({ error: err.message });
//     });
  
//     archive.pipe(output);
//     archive.directory(`./compressed/${socketId}/`, false);
//     archive.finalize();
//   });
  
//   app.post("/no-compress", upload.array("img"), (req, res) => {
//     const images = req.files;
//     const { brand, model, newNames, extensions } = req.body;
//     for (let [ind, img] of images.entries()) {
//       fs.writeFile(`../Compressed Images/${newNames[ind]}.${extensions[ind]}`, img.buffer, () => {});
//       const command = `ex.exe "../Compressed Images/${newNames[ind]}.${extensions[ind]}" -overwrite_original -Make="${brand}" -Model="${model}" -OffsetTimeOriginal="+08:00"`;
//       exec(command, (error, stdout) => {
//         if (error) console.error(`exec error: ${error}`);
//         else console.log(stdout.trim());
//       });
//     }
//     res.sendStatus(200);
//   });
  
//   // SOCKET.IO
//   const users = new Set();
//   const server = createServer(app);
//   const io = new Server(server, { cors: { origin: ORIGIN } });
  
//   io.on("connection", (socket) => {
//     console.log(`${socket.id} connected`);
//     users.add(String(socket.id));
  
//     socket.on("disconnect", () => {
//       users.delete(String(socket.id));
//       console.log(`${socket.id} disconnected`);
  
//       rimraf(`./compressed/${socket.id}.zip`);
//       rimraf(`./compressed/${socket.id}`);
//     });
//   });