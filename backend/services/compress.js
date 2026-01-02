import sharp from "sharp";

const compress = async (image, newFileName, effort, quality, resolution) => {
  const dest = `../Compressed Images/${newFileName || image.originalname.substring(0, image.originalname.lastIndexOf("."))}.avif`;
  const res = await sharp(image.path).resize(resolution, resolution, { fit: "outside", withoutEnlargement: true }).avif({ effort, quality }).keepExif().keepIccProfile().toFile(dest);
  return { newSize: res.size, dest };
};

export default compress;
