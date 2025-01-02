import { spawn } from "child_process";
import path from "path";
import saveFileFromBuffer from "./saveFileFromBuffer.js";

const compressLibAvif = async (image, newFileName, effort, quality, resolution) => {
  const filePath = path.join("temp", image.originalname)
  await saveFileFromBuffer(image.buffer, filePath);
  newFileName = newFileName || image.originalname.substring(0, image.originalname.lastIndexOf("."));
  runCommand(quality, filePath, newFileName, effort, resolution);
};

const runCommand = async (quality, filePath, newFileName, effort, resolution) => {  
  const command = spawn(path.resolve("./avifenc.exe"), ["-q", quality, filePath, `${newFileName}.avif`]);
  try {
    for await (const data of command.stdout) console.log(`stdout: ${data.toString()}`);
    for await (const data of command.stderr) console.error(`stderr: ${data.toString()}`);
    const exitCode = await new Promise((resolve, _) => command.on("close", (code) => resolve(code)));
    console.log(`Child process exited with code ${exitCode}`);
  } catch (error) {
    console.error("Error:", error);
  }
};

export default compressLibAvif;