import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);

const exif = async (source, exif) => {
  let command = `ex.exe "${source}"`;

  if (exif ){
    const { brand, model, orientation, newDate } = exif;
    if (brand) command += ` -Make="${brand}"`;
    if (model) command += ` -Model="${model}"`;
    if (newDate) command += ` -DateTimeOriginal="${newDate}" -CreateDate="${newDate}" -OffsetTime="+08:00" -OffsetTimeOriginal="+08:00"`;
    if (orientation) command += ` -Orientation="${orientation}"`;
  }
  
  command += ` -ThumbnailImage= -m -overwrite_original`;
  try {
    const { stdout } = await exec(command);
    if (stdout) console.log(stdout.trim());
  } catch (error) {
    console.error("Error executing exif command:", error);
  }
};

export default exif;
