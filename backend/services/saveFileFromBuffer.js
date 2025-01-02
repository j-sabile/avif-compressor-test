import fs from "fs/promises";

/**
 * Saves a file from a buffer to the specified path.
 * @param {Buffer} buffer - The buffer containing the file data.
 * @param {string} filePath - The path where the file should be saved.
 */
const saveFileFromBuffer = async (buffer, filePath) => {
  try {
    await fs.writeFile(filePath, buffer);
    // console.log(`File saved to ${filePath}`);
  } catch (err) {
    console.error(`Error saving file: ${err.message}`);
  }
};

export default saveFileFromBuffer;
