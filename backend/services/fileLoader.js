import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safely loads a JSON file relative to the project root
 * @param {string} relativePath - Path relative to project root
 * @returns {Promise<object>} Parsed JSON data
 */
const loadJsonFile = async (relativePath) => {
  // Resolve from project root (where package.json is)
  const projectRoot = path.resolve(__dirname, ".."); // Adjust based on structure
  const absolutePath = path.resolve(projectRoot, relativePath);

  const data = await fs.readFile(absolutePath, "utf-8");
  return JSON.parse(data);
};

export default loadJsonFile;
