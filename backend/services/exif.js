import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);
const orientationMap = { "Horizontal (normal)": 0, "Rotate 90 CW": 1, "Rotate 180": 2, "Rotate 270 CW": 3 };
const orientationArray = Object.keys(orientationMap);

const exif = async (source, exif) => {
  const { brand, model, orientation } = exif;

  let command = `ex.exe "${source}"`;
  if (brand) command += ` -Make="${brand}"`;
  if (model) command += ` -Model="${model}"`;

  try {
    if (orientation) {
      // if (orientation !== undefined) {
      //   if (typeof orientation === "string") {
      //     command += ` -orientation#=2`;
      //   } else {
      const { stdout } = await exec(`ex.exe "${source}" -orientation`);
      const currentOrientation = stdout.match(/:\s*(.*)/)[1];
      const currentIndex = orientationMap[currentOrientation];
      const newIndex = (currentIndex + orientation + 4) % 4;
      const newOrientation = orientationArray[newIndex];
      command += ` -Orientation="${newOrientation}"`;
      //   }
    }
    command += ` -m -overwrite_original`;
    const { stdout } = await exec(command);
    if (stdout) console.log(stdout.trim());
  } catch (error) {
    console.error("Error executing exif command:", error);
  }
};

export default exif;
