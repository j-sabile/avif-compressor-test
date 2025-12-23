import { IMG_PATTERNS, SS_PATTERNS } from "../constants.js";

const rename = (filename) => {
  for (let [_, pattern] of IMG_PATTERNS.entries()) {
    if (!pattern.test(filename)) continue;
    const [, year, month, day, hour, minute, second, millisecond] = filename.match(pattern);
    const newFileName = `IMG_${year}${month}${day}_${hour}${minute}${second}${millisecond}`;
    const n = 22 - newFileName.length;
    if (n == 0) return newFileName;
    else if (n < 0) return newFileName.slice(0, n);
    return newFileName + String(Math.floor(Math.random() * Math.pow(10, n)).toString()).padStart(n, "0");
  }
  for (let [_, pattern] of SS_PATTERNS.entries()) {
    if (!pattern.test(filename)) continue;
    let [, year, month, day, hour, minute, second, millisecond, app] = filename.match(pattern);
    console.log(app);
    
    if (!app) app = ""    
    if (!millisecond) millisecond = Math.random() * 1000;
    const newFileName = `Screenshot_${year}${month}${day}_${hour}${minute}${second}${millisecond}_${app}`;
    return newFileName;
    // const n = 29 - newFileName.length;
    // if (n == 0) return newFileName;
    // else if (n < 0) return newFileName.slice(0, n);
    // return newFileName + String(Math.floor(Math.random() * Math.pow(10, n)).toString()).padStart(n, "0");
  }
  const fbPattern = /^\d{8}_\d{6} - (.*)/;
  if (fbPattern.test(filename)) return filename.match(fbPattern)[1];
  return filename;
};

export default rename;
