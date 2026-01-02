import { ALLOWED_FORMATS, API } from "../constants";
import { derived, get, writable } from "svelte/store";
import type { IImage } from "../interfaces/IImage";
import moment, { type Moment } from "moment";
import rename from "../utils/rename";
import getDate from "../utils/getDate";
import autoChangeMakeModelAllImages from "../utils/autoChangeMakeModel";

interface IImageStore {
  images: IImage[];
  currImage: number;
  quality: number;
  effort: number;
  resolution: number;
}

function convertCoordinate(coordinate) {
  if (!coordinate) return undefined;
  const parts = coordinate.split(/[ '"]+/);
  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[2]);
  const seconds = parseFloat(parts[3]);
  const direction = parts[4];
  const decimal = degrees + minutes / 60 + seconds / 3600;
  return direction === "N" || direction === "E" ? String(decimal) : String(-decimal);
}

function createStore() {
  const { subscribe, set, update } = writable<IImageStore>({
    images: [],
    currImage: 0,
    quality: 60,
    effort: 6,
    resolution: 1080,
  });

  return {
    subscribe,
    set: (images: IImage[]) => update((state) => ({ ...state, images })),
    addImages: (images: IImage[]) => {
      const temp: IImage[] = [];
      images.forEach((img) => {
        img.extension = img.name.split(".").pop().toLowerCase();
        img.currName = img.name.slice(0, img.name.lastIndexOf("."));
        img.newName = img.currName;
        if (ALLOWED_FORMATS.includes(img.extension)) temp.push(img);
      });
      images.forEach((img) => {
        if (/~\d$/.test(img.currName)) {
          img.metadata = temp.find((i) => i.currName === img.currName.replace(/~\d$/, ""));
}      });
      update((state) => ({ ...state, images: [...state.images, ...temp] }));
    },
    autoChangeMakeModel: async () => {
      let currentState: IImageStore;
      update((state) => {
        currentState = state;
        return state;
      });
      const updatedImages = await autoChangeMakeModelAllImages(currentState!.images);
      update((state) => ({ ...state, images: updatedImages }));
    },
    renameAll: () => {
      // const newFileNames = new Set();
      const temp = get(images).images;
      for (let [ind, img] of temp.entries()) {
        temp[ind].newName = rename(img.name.slice(0, img.name.lastIndexOf(".")));
      }
      update((state) => ({ ...state, images: temp }));
    },
    changeNameCurrImg: (newName: string) => {
      update((state) => {
        let temp = { ...state };
        temp.images[state.currImage].newName = newName;
        return temp;
      });
    },
    changeDateCurrImg: (date: Moment) => {
      update((state) => {
        let temp = { ...state };
        temp.images[state.currImage].newDate = date;
        return temp;
      });
    },
    changeCameraCurrImg: (make: string, model: string, iso: number, fLength: number, shutterSpeed: string, aperture: number) => {
      update((state) => {
        let temp = { ...state };
        temp.images[state.currImage].newMake = make;
        temp.images[state.currImage].newModel = model;
        temp.images[state.currImage].newIso = iso;
        temp.images[state.currImage].newFLength = fLength;
        temp.images[state.currImage].newShutterSpeed = shutterSpeed;
        temp.images[state.currImage].newAperture = aperture;
        return temp;
      });
    },
    changeLocationCurrImg: (lat: string, lng: string) => {
      update((state) => {
        let temp = { ...state };
        state.images[state.currImage].newLat = lat;
        state.images[state.currImage].newLng = lng;
        return temp;
      });
    },
    changeAllMakeModel: (make: string, model: string) => {
      update((state) => {
        let temp = { ...state };
        temp.images.forEach((img) => {
          img.newMake = make;
          img.newModel = model;
        });
        return temp;
      });
    },
    changeMakeModel: (make: string, model: string, index: number) => {
      update((state) => {
        let temp = { ...state };
        temp.images[index].newMake = make;
        temp.images[index].newModel = model;
        return temp;
      });
    },
    changeOrientationCurrImg: (orientation: string) => {
      update((state) => {
        let temp = { ...state };
        state.images[state.currImage].newOrientation = orientation;
        return temp;
      });
    },
    generateExif: async () => {
      const formData = new FormData();
      let tempImages = get(images).images;
      tempImages.forEach((img) => formData.append("exif", img));
      const res = await fetch(`${API}/exif`, { method: "POST", body: formData });
      const data = await res.json();
      update((state) => {
        tempImages.forEach((img, ind) => {
          img.height = data.exifs[ind]["height"];
          img.width = data.exifs[ind]["width"];
          img.make = data.exifs[ind]["make"];
          img.model = data.exifs[ind]["model"];
          img.newMake = img.newMake ?? img.make;
          img.newModel = img.newModel ?? img.model;
          img.newAperture = img.aperture = data.exifs[ind]["aperture"];
          img.newShutterSpeed = img.shutterSpeed = data.exifs[ind]["shutterSpeed"];
          img.newIso = img.iso = Number(data.exifs[ind]["ISO"]);
          img.newFLength = img.fLength = Number(data.exifs[ind]["focalLength"]);
          // img.newDate = moment(img.newName.replace("IMG_", ""), "YYYYMMDD_HHmmssSSS");
          img.date = moment(data.exifs[ind]["dateTimeOriginal"], "YYYY:MM:DD HH:mm:ss.SSSZ");
          img.newDate = img.newDate ?? img.date;
          img.newOrientation = img.orientation = data.exifs[ind]["orientation"];
          img.newLat = img.lat = data.exifs[ind]["gpsLatitude"];
          img.newLng = img.lng = data.exifs[ind]["gpsLongitude"];
        });
        return { ...state, images: tempImages };
      });
    },
    generateDates: () => {
      update((state) => {
        let imgs = [...state.images];
        imgs.forEach((img) => (img.newDate = getDate(img.newName)));
        console.log("Generated dates!");
        alert("Generated Dates!");
        return { ...state, images: imgs };
      });
    },
    changeQuality: (quality: number) => {
      update((state) => {
        let temp = { ...state };
        state.quality = quality;
        return temp;
      });
    },
    changeResolution: (resolution: number) => {
      update((state) => {
        let temp = { ...state };
        state.resolution = resolution;
        return temp;
      });
    },
    changeEffort: (effort: number) => {
      update((state) => {
        let temp = { ...state };
        state.effort = effort;
        return temp;
      });
    },
    flipImage: () => {
      update((state) => {
        let temp = { ...state };
        if (temp.images[temp.currImage].orientation === "bottom-left") temp.images[temp.currImage].newOrientation = "Rotate 180";
        else if (temp.images[temp.currImage].orientation === "top-right") temp.images[temp.currImage].newOrientation = "Horizontal (normal)";
        else if (temp.images[temp.currImage].orientation === "left-top") temp.images[temp.currImage].newOrientation = "Rotate 90";
        else temp.images[temp.currImage].newOrientation = "Mirror horizontal";
        return temp;
      });
    },
    prev: () => update((state) => ({ ...state, currImage: state.currImage > 0 ? state.currImage - 1 : state.currImage })),
    next: () => update((state) => ({ ...state, currImage: state.currImage < state.images.length - 1 ? state.currImage + 1 : state.currImage })),
  };
}

export const images = createStore();

export const currImg = derived(images, ($images) => $images.images[$images.currImage]);
export const newName = derived(images, ($images) => $images.images[$images.currImage].newName);
export const quality = derived(images, ($images) => $images.quality);
export const effort = derived(images, ($images) => $images.effort);
export const resolution = derived(images, ($images) => $images.resolution);
export const date = derived(images, ($images) => $images.images[$images.currImage].date);
export const lat = derived(images, ($images) => $images.images[$images.currImage].lat);
export const lng = derived(images, ($images) => $images.images[$images.currImage].lng);
