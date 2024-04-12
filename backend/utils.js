import fs from "fs";
import {exec} from "child_process";



function alterFileContent(filename, offset, newValue) {
  if (offset < 0) {
    throw new Error("Offset cannot be negative");
  }

  // Adapt the encoding based on your file's format:
  const encoding = "binary";
  Buffer.from("test", "binary");

  fs.readFile(filename, encoding, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    if (offset > data.length) {
      console.error("Offset is beyond the end of the file");
      return;
    }

    // Ensure newValue is of the expected type (string for text files)
    const newValueString = Buffer.from(newValue, encoding);

    // Create buffers to represent the file parts before and after the change
    const dataBefore = Buffer.from(data.slice(0, offset), encoding);
    const dataAfter = Buffer.from(data.slice(offset + newValueString.length), encoding);

    const newData = Buffer.concat([dataBefore, Buffer.from(newValueString), dataAfter]);

    fs.writeFile(filename, newData, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("File content altered successfully.");
      }
    });
  });
}

// Example usage:
const filename = "./PXL_20240405_110401777.jpg";
const offset = 158; // Start changing at the 11th character (zero-indexed)
const newValue = "Redmi 13C Maxemil";

// alterFileContent(filename, offset, newValue);

const ENCODING = "binary";

function getEntries(filename) {
  fs.readFile(filename, ENCODING, (err, data) => {
    data = Buffer.from(data, ENCODING);
    let ptr = 0;
    for (; ptr < 20; ptr++) if (data[ptr] === 73 && data[ptr] === data[ptr + 1]) break;
    const tiffOffset = ptr;
    ptr += 4;
    const numberOfIFD = data[ptr];
    const IFDOffset = data[ptr] + tiffOffset + 2;
  });
}

function changeEXIF(filename, patch) {
  fs.readFile(filename, ENCODING, (err, data) => {
    data = Buffer.from(data, ENCODING);

    // read patch
    let ifdsToBePatched = patch.map((i) => i.id);
    console.log(ifdsToBePatched);

    // get the exif section
    let ptr = 0;

    for (; ptr < 20; ptr++) if (data[ptr] === 255 && data[ptr + 1] === 225) break;
    const exifOffset = ptr;
    ptr += 2;
    const exifLen = data[ptr] * 16 ** 2 + data[ptr + 1];
    ptr += 2;

    for (; ptr < 20; ptr++) if (data[ptr] === 73 && data[ptr] === data[ptr + 1]) break;
    ptr += 2;
    const tiffOffset = ptr;
    ptr += 2;

    const ifd0Offset = readLittleEndianInt(data, ptr, 4) + tiffOffset;
    ptr += 4;
    let numOfIfds = readLittleEndianInt(data, ptr, 2);

    let ifds = [];
    for (let i = 0; i < numOfIfds; i++) {
      ifds.push({
        id: readLittleEndianHex(data, ifd0Offset + i * 12, 2),
        dataType: readLittleEndianInt(data, ifd0Offset + i * 12 + 2, 2),
        dataCount: readLittleEndianInt(data, ifd0Offset + i * 12 + 4, 4),
        value: readLittleEndianInt(data, ifd0Offset + i * 12 + 8, 4),
      });
    }
    console.log(ifds);

    // modify the len of to be updated ifd, add ifd if ifd tag cannot be found
    patch.forEach((ifdPatch) => editIfd(ifds, ifdPatch));
    console.log(ifds);

    // modify len of ifd if added ifd entry
    numOfIfds = ifds.length;

    // rebuild offsets of ifd entries
    
    // concat
  });
}

function editIfd(ifds, patch) {
  for (let i = 0; i < ifds.length; i++) {
    if (ifds[i].id === patch.id) {
      ifds[i].dataCount = patch.value.length;
      return;
    }
  }
  ifds.push({ id: patch.id, dataType: 2, dataCount: patch.value.length, value: null });
}

function readLittleEndianInt(buffer, offset, length) {
  let result = 0;
  let shift = 0;
  for (let i = 0; i < length; i++) {
    result |= buffer[offset + i] << shift;
    shift += 8;
  }
  return result;
}

function hexToInt(hex) {
  return parseInt(hexString, 16);
}

function readLittleEndianHex(buffer, offset, length) {
  let value = "";
  for (let i = length - 1; i >= 0; i--) {
    const byteHex = buffer[offset + i].toString(16).padStart(2, "0");
    value += byteHex;
  }
  return value;
}

function changeCameraEXIF(filename, make, cameraModelName) {
  fs.readFile(filename, ENCODING, (err, data) => {
    data = Buffer.from(data, ENCODING);

    const makeLen = make.length;
    const cameraModelNameLen = cameraModelName.length;
    let ptr = 146;
    const offset = 12;

    // change lens
    data[26] = makeLen;
    data[38] = cameraModelNameLen;

    // change offsets of ifd
    const makeOffset = ptr;
    ptr += makeLen;
    const cameraModelNameOffset = ptr;
    data[26 + 4] = makeOffset;
    data[38 + 4] = cameraModelNameOffset;

    // change values
    changeValue(data, makeOffset + offset, make);
    changeValue(data, cameraModelNameOffset + offset, cameraModelName);

    console.log(data.slice(158, 200));

    fs.writeFile(filename, data, (err) => {
      if (err) throw err;
      console.log("File modification complete!");
    });
  });
}

function changeValue(data, start, value) {
  for (let i = 0; i < value.length; i++) {
    data[start++] = value.charCodeAt(i);
  }
}
changeEXIF(filename, [
  { id: "010f", value: "Redmi 13C (Maximilien)" },
  { id: "0110", value: "Xiaomi" },
]);

// changeCameraEXIF(filename, "Xiaomi", "Redmi 13C (Maximilien)");
