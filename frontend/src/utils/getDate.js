import moment from "moment";

const filenamePatterns = [
  { regex: /^Screenshot_(\d{8}_\d{9})/, format: "YYYYMMDD_HHmmssSSS" },
  { regex: /^JPEG_(\d{8}_\d{6})/, format: "YYYYMMDD_HHmmss" },
  { regex: /^(\d{8}_\d{6})/, format: "YYYYMMDD_HHmmss"}
];

const getDate = (filename) => {
  let match = null;
  for (const pattern of filenamePatterns) {
    if (pattern.regex.test(filename)) {
      match = moment(filename.match(pattern.regex)[1], pattern.format);
      break;
    }
  }
  return match;
};

export default getDate;
