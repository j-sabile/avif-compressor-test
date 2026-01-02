import type { Moment } from "moment";

export interface IImage extends File {
  currName: string;
  newName: string;
  width: number;
  height: number;
  extension?: string;
  date?: Moment;
  newDate?: Moment;
  make?: string;
  model?: string;
  newMake?: string;
  newModel?: string;
  aperture?: number; // Aperture
  newAperture?: number;
  shutterSpeed?: string; // Shutter Speed
  newShutterSpeed?: string;
  iso?: number; // ISO
  newIso?: number;
  fLength?: number; // Focal Length In 35mm Format TODO: find the correct value
  newFLength?: number;
  orientation?: string;
  newOrientation?: string;
  lat?: string;
  lng?: string;
  newLat?: string;
  newLng?: string;
  metadata?: IImage;
}
