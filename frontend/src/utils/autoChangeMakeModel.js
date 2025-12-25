import { API } from "../constants";

const autoChangeMakeModelAllImages = async (images) => {
  const res = await fetch(`${API}/make-model-presets`);
  const presets = (await res.json()).presets;
  console.log(presets);

  const modifiedImages = images.map((image) => {
    return changeMakeModelImage(image, presets);
  });
  console.log(modifiedImages);

  return modifiedImages;
};

const changeMakeModelImage = (image, presets) => {
  for (const preset of presets) {
    if (preset.from.make === image.make && preset.from.model === image.model) {
      image.newMake = preset.to.make;
      image.newModel = preset.to.model;
      break;
    }
  }
  return image;
};

export default autoChangeMakeModelAllImages;
