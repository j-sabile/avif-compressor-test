import fs from "fs";

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
    changeValue(data, makeOffset+offset, make);
    changeValue(data, cameraModelNameOffset+offset, cameraModelName);

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

changeCameraEXIF(filename, "Xiaomi", "Redmi 13C (Maximilien)");
