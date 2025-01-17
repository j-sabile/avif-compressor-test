<script setup lang="ts">
  import Date from "../svg/Date.svelte";
  import Image from "../svg/Image.svelte";
  import Camera from "../svg/Camera.svelte";
  import Location from "../svg/Location.svelte";
  import Orientation from "../svg/Orientation.svelte";
  import ImagePropertyTile from "./ImagePropertyTile.svelte";
  import ImageModal from "./modals/ImageModal.svelte";
  import LocationModal from "./modals/LocationModal.svelte";
  import OrientationModal from "./modals/OrientationModal.svelte";
  import DateModal from "./modals/DateModal.svelte";
  import CameraModal from "./modals/CameraModal.svelte";
  import Modal from "./modals/Modal.svelte";
  import DebugButton from "./DebugButton.svelte";

  import { currImg, images } from "../stores/images";
  import presets from "../data/presets";
  import { API } from "../constants";
  import type { IImage } from "../interfaces/IImage";
  import MySpinner from "./MySpinner.svelte";

  onbeforeunload = () => {
    if (isRequestInProgress) return "";
  };

  interface IImageJSON extends IImage, File {
    exif?: {
      make?: string;
      model?: string;
      orientation?: string;
      date?: string;
      lat?: string;
      lng?: string;
    };
  }

  let resolution = "1080",
    quality = "60",
    effort = "6",
    inputPreset = "";

  let showImageModal = false,
    showDateModal = false,
    showCameraModal = false,
    showLocationModal = false,
    showOrientationModal = false;
  let imageDialog, dateDialog, cameraDialog, locationDialog, orientationDialog;

  const handleCompressBtnClick = (e) => {
    e.preventDefault();
    handleCompress(resolution, quality, effort);
  };

  const handleCompress = async (paramRes: string, paramQual: string, paramEffort: string) => {
    let image = $currImg as IImageJSON;

    const exifs = [];
    exifs.push({
      name: image.newName,
      make: image.make === image.newMake ? undefined : image.newMake,
      model: image.model === image.newModel ? undefined : image.newModel,
      date: image.date === image.newDate ? undefined : image.newDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"), // 2024-10-06T14:30:00.123+08:00
      lat: image.lat === image.newLat ? undefined : image.newLat,
      lng: image.lng === image.newLng ? undefined : image.newLng,
      iso: image.iso === image.newIso ? undefined : image.newIso,
      orientation: image.orientation === image.newOrientation ? undefined : image.newOrientation,
      fLength: image.fLength === image.newFLength ? undefined : image.newFLength,
      aperture: image.aperture === image.newAperture ? undefined : image.newAperture,
      shutter: image.shutterSpeed === image.newShutterSpeed ? undefined : image.newShutterSpeed,
    });

    const formData = new FormData();
    formData.append("resolution", paramRes);
    formData.append("quality", paramQual);
    formData.append("effort", paramEffort);
    formData.append("img", image);
    formData.append("exifs", JSON.stringify(exifs));

    makeRequest(formData);
  };

  let isRequestInProgress = false;
  let requestQueue = [];

  async function makeRequest(data) {
    if (isRequestInProgress) {
      requestQueue.push(data);
      return;
    }

    isRequestInProgress = true;
    try {
      const response = await fetch(`${API}/image`, { method: "POST", body: data });
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isRequestInProgress = false;

      if (requestQueue.length > 0) {
        const nextData = requestQueue.shift();
        makeRequest(nextData);
      }
    }
  }

  const getResAndQual = (): undefined | [string, string] => {
    const selectedPreset = presets[inputPreset];
    if (selectedPreset !== undefined) return [selectedPreset[0], selectedPreset[1]];
    const match = inputPreset.match(/(\d+) (\d+)/);
    if (match) return [match[1], match[2]];
    else return undefined;
  };

  const handleEnterPreset = (e) => {
    e.preventDefault();
    const data = getResAndQual();
    if (data) {
      handleCompress(data[0], data[1], effort);
      images.next();
    } else alert("Incorrect preset");

    inputPreset = "";
  };
</script>

<section class="flex flex-col bg-[#111] min-w-[375px] p-4 flex-grow">
  <h3 class="text-lg font-semibold w-full">Details</h3>
  <div class="flex flex-col justify-start items-center gap-10 w-full py-6">
    <DebugButton />
    <ImagePropertyTile bind:show={showImageModal}>
      <span slot="title">{$currImg.newName}</span>
      <span slot="subtitle">{(($currImg.height * $currImg.width) / 1000000).toFixed(1)}MP &nbsp; {$currImg.width} × {$currImg.height} &nbsp; {($currImg.size / 1024 ** 2).toFixed(2)}MB</span>
      <Image size={30} slot="icon" color="#FFF" />
    </ImagePropertyTile>
    <ImagePropertyTile bind:show={showDateModal}>
      <span slot="title">{$currImg.newDate.format("MMMM D, YYYY")}</span>
      <span slot="subtitle">{$currImg.newDate.format("hh:mm A Z")}</span>
      <Date size={30} slot="icon" color="#FFF" />
    </ImagePropertyTile>
    <ImagePropertyTile bind:show={showCameraModal}>
      <span slot="title">{`${$currImg.newMake} ${$currImg.newModel}`}</span>
      <span slot="subtitle">{`ƒ/${$currImg.newAperture}`} &nbsp; {$currImg.newShutterSpeed} &nbsp; {$currImg.newFLength}mm &nbsp; {`ISO${$currImg.newIso}`}</span>
      <Camera size={30} slot="icon" color="#FFF" />
    </ImagePropertyTile>
    <ImagePropertyTile bind:show={showLocationModal}>
      <span slot="title">{`${Number($currImg.newLat)?.toFixed(6)}, ${Number($currImg.newLng)?.toFixed(6)}`}</span>
      <Location size={30} slot="icon" color="#FFF" />
    </ImagePropertyTile>
    <ImagePropertyTile bind:show={showOrientationModal}>
      <span slot="title">{$currImg.newOrientation}</span>
      <Orientation size={30} slot="icon" color="#FFF" />
    </ImagePropertyTile>
  </div>
  <div class="flex flex-col flex-grow justify-end">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <div class="flex flex-row justify-center items-center gap-2">
        <label for="quality">Quality: </label>
        <input type="number" id="quality" bind:value={quality} class="text-center w-16 px-1 py-1 border-[#444] border rounded" placeholder="Quality" min="0" max="100" />
      </div>
      <div class="flex flex-row justify-center items-center gap-2">
        <label for="effort">Effort: </label>
        <input type="number" id="effort" bind:value={effort} class="text-center w-16 px-1 py-1 border-[#444] border rounded" placeholder="Effort" min="0" max="9" />
      </div>
      <div class="flex flex-row justify-center items-center gap-2">
        <label for="resolution">Resolution: </label>
        <input type="number" id="resolution" bind:value={resolution} class="text-center w-20 px-1 py-1 border-[#444] border rounded" placeholder="Resolution" min="0" />
      </div>
    </div>
    <div class="flex justify-between w-full mt-4">
      <form class="flex items-center gap-2" on:submit={handleEnterPreset}>
        <label for="preset">Preset:</label>
        <input type="text" id="preset" class="text-center w-20 px-1 py-1 border-[#444] border rounded" bind:value={inputPreset} />
      </form>
      <button on:click={handleCompressBtnClick} class="font-semibold text-xl bg-white text-black rounded px-[25px] py-[10px]">Compress<MySpinner /></button>
    </div>
  </div>
</section>

<Modal bind:show={showImageModal} bind:dialog={imageDialog}>
  <ImageModal bind:show={showImageModal} bind:dialog={imageDialog} />
</Modal>
<Modal bind:show={showDateModal} bind:dialog={dateDialog}>
  <DateModal bind:show={showDateModal} bind:dialog={dateDialog} />
</Modal>
<Modal bind:show={showCameraModal} bind:dialog={cameraDialog}>
  <CameraModal bind:show={showCameraModal} bind:dialog={cameraDialog} />
</Modal>
<Modal bind:show={showLocationModal} bind:dialog={locationDialog}>
  <LocationModal bind:show={showLocationModal} bind:dialog={locationDialog} />
</Modal>
<Modal bind:show={showOrientationModal} bind:dialog={orientationDialog}>
  <OrientationModal bind:show={showOrientationModal} bind:dialog={orientationDialog} />
</Modal>

<style>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
