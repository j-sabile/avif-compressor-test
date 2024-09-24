import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path from "path";
import fs from "fs";

const exec = promisify(execCallback);

const getExif = async (req, res) => {
  const images = req.files;
  const tempDir = path.join(process.cwd(), "temp");

  const exifs = [];
  for (const img of images) {
    const filePath = path.join(tempDir, img.originalname);
    await fs.promises.writeFile(filePath, img.buffer);

    try {
      const { stdout } = await exec(`ex.exe "${filePath}"`);
      const exifDataForImage = parseExifOutput(stdout);
      exifs.push(exifDataForImage);
    } catch (error) {
      console.error(`Error processing image: ${error.message}`);
    } finally {
      await fs.promises.unlink(filePath);
    }
  }

  res.status(200).json({ message: "Success", exifs });
};

function parseExifOutput(output) {
  const lines = output.split("\n");
  const exifData = {};
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      exifData[key] = value;
    }
  }
  return exifData;
}

export default getExif;
