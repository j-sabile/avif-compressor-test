import { MAKEMODELPRESETPATH } from "../constants.js";
import loadJsonFile from "../services/fileLoader.js";

const getMakeModelPresets = async (_, res) => {
  try {
    const jsonData = await loadJsonFile(MAKEMODELPRESETPATH);
    res.json(jsonData);
  } catch (error) {
    console.error("Error loading JSON file:", error);
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "File not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default getMakeModelPresets;
