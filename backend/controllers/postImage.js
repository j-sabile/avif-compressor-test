import sharp from "sharp";
import fs from "fs";
import { exec } from "child_process";
import exif from "../services/exif.js";
import compressLibAvif from "../services/compressLibAvif.js";
import compress from "../services/compress.js";
import path from "path";

// CURRENT
const processImages = async (req, res) => {
  const images = req.files;
  const quality = parseInt(req.body.quality);
  const effort = parseInt(req.body.effort);
  const resolution = parseInt(req.body.resolution);
  const newFileName = req.body.newFileName;
  const exifData = req.body.exif ? JSON.parse(req.body.exif) : null;
  const exifs = req.body.exifs ? JSON.parse(req.body.exifs) : null;
  const toCompress = req.body?.compress === "true";
  // console.log(effort, quality, resolution, images);

  const results = await Promise.all(
    images.map(async (img, ind) => {
      if (toCompress) {
        try {
          const { newSize, dest } = await compress(img, exifs[ind].name, effort, quality, resolution);
          await exif(dest, exifs[ind]);
          return { originalSize: img.size, newSize };
        } catch {
          return { originalSize: 0, newSize: 0};
        }
      } else {
        const dest = path.join("..", "Edited EXIFs", img.originalname);
        await fs.promises.writeFile(dest, img.buffer);
        await exif(dest, exifs[ind]);
        return { originalSize: img.size, newSize: img.size };
      }
    })
  );
  return res.status(200).json({ message: "Success", results });
};

// OLD, NOT BEING USED
const compressImageCopy = async (req, res) => {
  const images = req.files;
  const quality = parseInt(req.body.quality);
  const effort = parseInt(req.body.effort);
  const resolution = parseInt(req.body.resolution);
  const newFileName = req.body.newFileName;
  const exif = req.body.exif ? JSON.parse(req.body.exif) : null;

  let info = "";
  const results = [];
  const promises = [];
  images.forEach((img) => results.push({ originalSize: img.size, newSize: 0 }));
  for (let [ind, img] of images.entries()) {
    // console.log(img)
    const dest = `../Compressed Images/${newFileName || img.originalname.substring(0, img.originalname.lastIndexOf("."))}.avif`;
    promises.push(
      await sharp(img.buffer)
        .resize(resolution, resolution, { fit: "outside", withoutEnlargement: true })
        .avif({ effort, quality })
        .keepExif()
        .keepIccProfile()
        .toFile(dest)
        .then((res) => (results[ind].newSize = res.size))
    );

    await Promise.all(promises);

    if (exif) {
      const { brand, model, orientation } = exif;
      let command = `ex.exe "${dest}"`;
      if (brand) command += ` -Make="${brand}"`;
      if (model) command += ` -Model="${model}"`;

      // 1 = Horizontal (normal)
      // 2 = Mirror horizontal
      // 3 = Rotate 180
      // 4 = Mirror vertical
      // 5 = Mirror horizontal and rotate 270 CW
      // 6 = Rotate 90 CW
      // 7 = Mirror horizontal and rotate 90 CW
      // 8 = Rotate 270 CW
      const a = { "Horizontal (normal)": 0, "Rotate 90 CW": 1, "Rotate 180": 2, "Rotate 270 CW": 3 };
      const b = ["Horizontal (normal)", "Rotate 90 CW", "Rotate 180", "Rotate 270 CW"]; //[...a.keys()]
      const c = ["Mirror horizontal", "Mirror horizontal and rotate 90 CW"];
      const d = ["Mirror vertical"];

      if (typeof orientation === "string") {
        command += ` -orientation#=2 -m -overwrite_original`;
        exec(command, (error, stdout) => {
          if (error) console.log(error);
          if (stdout) console.log(stdout.trim());
        });
      } else if (orientation) {
        const temp = `ex.exe "${dest}" -orientation`;
        exec(temp, (err, stdout) => {
          const currentOrientation = stdout.match(/:\s*(.*)/)[1];
          console.log("currentOrientation", currentOrientation, a[currentOrientation], orientation, b.at((a[currentOrientation] + orientation) % 4));
          const newOrientation = b.at((a[currentOrientation] + orientation) % 4);
          command += ` -Orientation="${newOrientation}" -m -overwrite_original`;
          exec(command, (error, stdout) => {
            if (error) console.log(error);
            if (stdout) console.log(stdout.trim());
          });
        });
      } else {
        command += ` -m -overwrite_original`;
        exec(command, (error, stdout) => {
          if (error) console.log(error);
          if (stdout) console.log(stdout.trim());
        });
      }
    }
  }

  return res.status(200).json({ message: "Success", results, info });
};

export default processImages;
