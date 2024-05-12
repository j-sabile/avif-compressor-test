const filenames = [
  "00000IMG_00000_BURST20230207093304056_COVER",
  "00100sPORTRAIT_00100_BURST20230207093337413_COVER",
  "AGC_20240510_204752288",
  "IMG_20230201_063540_Hyper",
  "IMG_20230201_063636",
  "PANO_20230204_152657",
  "Screenshot_2023-02-05-13-39-18-854_com.mobile.legends",
];

const rename = (filename) => {
  const patterns = [
    /^PXL_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
    /^AGC_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
    /^IMG_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
    /^00000IMG_00000_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
    /^00100sPORTRAIT_00100_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
    /^PANO_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
  ];

  const ssPatterns = [/^Screenshot_(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d*)((_[a-z]+)(\.[a-z]+))*/];

  for (let [_, pattern] of patterns.entries()) {
    if (!pattern.test(filename)) continue;
    const [, year, month, day, hour, minute, second, millisecond] = filename.match(pattern);
    const newFileName = `IMG_${year}${month}${day}_${hour}${minute}${second}${millisecond}`;
    const n = 22 - newFileName.length;
    if (n == 0) return newFileName;
    else if (n < 0) return newFileName.slice(0, n);
    return newFileName + String(Math.floor(Math.random() * Math.pow(10, n)).toString()).padStart(n, "0");
  }
  for (let [_, pattern] of ssPatterns.entries()) {
    if (!pattern.test(filename)) continue;
    const [, year, month, day, hour, minute, second, millisecond] = filename.match(pattern);
    const newFileName = `Screenshot_${year}${month}${day}_${hour}${minute}${second}${millisecond}`;
    const n = 29 - newFileName.length;
    if (n == 0) return newFileName;
    else if (n < 0) return newFileName.slice(0, n);
    return newFileName + String(Math.floor(Math.random() * Math.pow(10, n)).toString()).padStart(n, "0");
  }
  return "No Match";
};

filenames.forEach((filename, ind) => {
  const res = rename(filename);
  /^IMG_(\d{8})_(\d{9})$/.test(res) || /^Screenshot_(\d{8})_(\d{9})$/.test(res) ? console.log(`Test ${ind + 1}: SUCCESS`) : console.log(`Test ${ind + 1}: FAIL`);
});
