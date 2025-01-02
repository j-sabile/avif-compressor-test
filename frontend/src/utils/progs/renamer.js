import fs from "fs/promises";
import renamev2 from "../renamev2.js";

const INPUT_PATH = "../../../images";

const renameImages = async () => {
  try {
    const files = await fs.readdir(INPUT_PATH);
    const filePromises = files.map(async (img) => {
      const { fullFileName } = renamev2(img);
      if (!fullFileName) return console.log(`✘  ${img}: No match!`);
      await fs.rename(`${INPUT_PATH}/${img}`, `${INPUT_PATH}/${fullFileName}`);
      console.log(`✔  ${img} => ${fullFileName}`);
    });
    await Promise.all(filePromises);
  } catch (error) {
    console.error("Error renaming file:", error);
  }
};

renameImages();
