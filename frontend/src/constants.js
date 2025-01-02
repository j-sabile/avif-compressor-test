export const ALLOWED_FORMATS = ["jpg", "webp", "jpeg", "png", "avif"];
export const IMG_PATTERNS = [
  /^PXL_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
  /^AGC_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
  /^IMG_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
  /^00000IMG_00000_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
  /^00100sPORTRAIT_00100_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
  /^00000PORTRAIT_00000_BURST(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/,
  /^PANO_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d*)/,
];
export const SS_PATTERNS = [/^Screenshot_(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d*)((_[a-z]+)(\.[a-z]+))*/];
export const API = import.meta.env.VITE_API || "http://localhost:3000";

export const RESOLUTION = "1080";
export const QUALITY = "50";
export const EFFORT = "0";
export const NEWFILENAME = "test"