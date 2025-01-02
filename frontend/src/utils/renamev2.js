const IMG_PATTERNS = [
  /^AGC_(\d{8}_\d{9}).*(\.[^.]+$)/,
  /^IMG_(\d{8}_\d{9}).*(\.[^.]+$)/,
  /^IMG_(\d{8}_\d{6}).*(\.[^.]+$)/,
  /^PXL_(\d{8}_\d{6}).*(\.[^.]+$)/,
  // /^PXL_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
  // /^AGC_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
  // /^IMG_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
  // /^00000IMG_00000_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
  // /^00100sPORTRAIT_00100_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
  // /^00000PORTRAIT_00000_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
  // /^PANO_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
];

const renamev2 = (filename) => {
  for (const pattern of IMG_PATTERNS) {
    if (pattern.test(filename)) {
      const match = filename.match(pattern);
      const extension = match[2];
      let baseName = `IMG_${match[1]}`;
      baseName += Array.from({ length: 22 - baseName.length }, () => Math.floor(Math.random() * 10)).join("");
      return { baseName, extension, fullFileName: `${baseName}${extension}` };
    }
  }
  return {};
};

export default renamev2;
