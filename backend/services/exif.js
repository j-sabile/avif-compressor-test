import { promisify } from "util";
import { exec as execCallback } from "child_process";
import { spawn } from "child_process";

const exec = promisify(execCallback);

const exif = async (source, exif) => {
  let command = `ex.exe "${source}"`;

  if (exif) {
    const { make, model, orientation, date, lat, lng, aperture, iso, fLength, shutter } = exif;
    if (make) command += ` -Make="${make}"`;
    if (model) command += ` -Model="${model}"`;
    if (date) command += ` -DateTimeOriginal="${date}" -CreateDate="${date}" -OffsetTime="+08:00" -OffsetTimeOriginal="+08:00"`;
    if (orientation) command += ` -Orientation="${orientation}"`;
    if (lat && lng) command += ` -GPSLatitude=${lat} -GPSLongitude=${lng} -GPSLatitudeRef=${lat > 0 ? "N" : "S"} -GPSLongitudeRef=${lng > 0 ? "E" : "W"} -GPSAltitude=0 -GPSAltitudeRef=0`; // TODO: investigate DateTime (-GPSDateTime="2024:09:25 22:56:29Z")
    if (aperture) command += ` -Aperture=1.8 -FNumber=1.8 -ApertureValue=1.8`;
    if (iso) command += ` -ISO=${iso}`;
    if (fLength) command += ` -FocalLength="${fLength} mm"`;
    if (shutter) command += ` -ExposureTime="${shutter}" -ShutterSpeedValue="${shutter}" -ShutterSpeed="${shutter}"`;
  }

  command += ` -ThumbnailImage= -ImageDescription= -m -overwrite_original`;
  // console.log(command);

  try {
    const { stdout } = await exec(command);
    // if (stdout) console.log(stdout.trim());
  } catch (error) {
    console.error("Error executing exif command:", error);
  }
};

/**
 * Copies essential EXIF metadata from source to target.
 * @param {string} sourcePath - Path to the original file.
 * @param {string} targetPath - Path to the file receiving the metadata.
 * @param {object} options - Toggle metadata (orientation, thumbnail).
 */
const copyEssentialEXIF = (sourcePath, targetPath, { orientation = true, thumbnail = true } = {}) => {
  const args = ["-TagsFromFile", sourcePath, "-all:all"];

  // Disable tags conditionally
  if (!orientation) args.push("--Orientation");
  if (!thumbnail) args.push("--ThumbnailImage");

  args.push(targetPath, "-overwrite_original");

  return new Promise((resolve, reject) => {
    const exifProcess = spawn("../ex.exe", args);

    let errorData = "";
    exifProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    exifProcess.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true, message: "Metadata copied successfully." });
      } else {
        reject(new Error(`ExifTool failed with code ${code}: ${errorData}`));
      }
    });
  });
};

export { exif, copyEssentialEXIF };
