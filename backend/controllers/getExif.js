import { promisify } from "util";
import { exec as execCallback } from "child_process";
import path from "path";
import fs from "fs";
import ExifReader from "exifreader";

const exec = promisify(execCallback);

const getExif = async (req, res) => {
  const images = req.files;
  const tempDir = path.join(process.cwd(), "temp");

  const exifs = [];
  for (const img of images) {
    const exifReaderOutput = ExifReader.load(img.buffer);
    const parsedExifData = parseExifReaderOutput(exifReaderOutput);
    exifs.push(parsedExifData);
  }

  res.status(200).json({ message: "Success", exifs });
};

function parseExifReaderOutput(output) {
  return {
    height: output["Image Height"]?.value,
    width: output["Image Width"]?.value,
    make: output["Make"]?.description,
    model: output["Model"]?.description,
    dateTimeOriginal: output["DateTimeOriginal"]?.description,
    aperture: output["ApertureValue"]?.description,
    shutterSpeed: output["ShutterSpeedValue"]?.description,
    ISO: output["ISOSpeedRatings"]?.description,
    focalLength: (output["FocalLength"]?.value[0] / output["FocalLength"]?.value[1]).toFixed(2),
    orientation: output["Orientation"]?.description,
    gpsLatitude: output["GPSLatitude"]?.description,
    gpsLongitude: output["GPSLongitude"]?.description,
  };
}

export default getExif;
