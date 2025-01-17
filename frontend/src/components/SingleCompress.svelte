<script lang="ts">
  import { API } from "../constants";
  import { fly } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";

  export let images;
  export let brand;
  export let model;

  import presets from "../data/presets";
  import Slider from "./Slider.svelte";
  import Spinner from "./Spinner.svelte";
  import Prev from "../svg/Prev.svelte";
  import Next from "../svg/Next.svelte";
  import RotateCcw from "../svg/RotateCCW.svelte";
  import RotateCw from "../svg/RotateCW.svelte";
  import MirrorHorizontally from "../svg/MirrorHorizontally.svelte";
  import moment from "moment";
  import Map from "./Map.svelte";
  import DebugButton from "./DebugButton.svelte";
  import { images as imagesStore, currImg as currentImage } from "../stores/images";
  import Sidebar from "./Sidebar.svelte";

  let queue = [];
  let currImg = 0;
  let inputPreset = "";
  let effort = 6;
  let orientationOffset = null;
  let newDate = {
    year: images[0].date.format("YYYY"),
    month: images[0].date.format("MM"),
    day: images[0].date.format("DD"),
    hour: images[0].date.format("HH"),
    minute: images[0].date.format("mm"),
    second: images[0].date.format("ss"),
  };

  const getOrientation = () => {
    if (orientationOffset === "mirror") return "Mirror horizontal";

    const curOrie = images[currImg].orientation;
    const orientationMap = { "Horizontal (normal)": 0, "Rotate 90 CW": 1, "Rotate 180": 2, "Rotate 270 CW": 3 };
    const orientationArray = Object.keys(orientationMap);
    const currentIndex = orientationMap[curOrie];
    const newIndex = (currentIndex + orientationOffset + 4) % 4;
    return orientationArray[newIndex];
  };

  const getNewDate = () => {
    const { year, month, day, hour, minute, second } = newDate;
    const temp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return temp;
  };

  const getResAndQual = (): undefined | [string, string] => {
    const selectedPreset = presets[inputPreset];
    if (selectedPreset !== undefined) return [selectedPreset[0], selectedPreset[1]];
    const match = inputPreset.match(/(\d+) (\d+)/);
    if (match) return [match[1], match[2]];
    else return undefined;
  };

  const handleEnterPreset = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const data = getResAndQual();
    if (data === undefined) return alert("Invalid Input!");

    formData.append("resolution", data[0]);
    formData.append("quality", data[1]);
    formData.append("effort", String(effort));
    formData.append("img", images[currImg]);
    if (images[currImg].newName) formData.append("newFileName", images[currImg].newName);

    let exif: { brand?: string; model?: string; orientation?: string; newDate?: string } = {};
    if (brand) exif.brand = brand;
    if (model) exif.model = model;
    if (orientationOffset) exif.orientation = getOrientation();
    if (moment(getNewDate()).isValid() && images[currImg].date.format("YYYY-MM-DD HH:mm:ss") !== `${getNewDate()}`) exif.newDate = `${getNewDate()}.000+08:00`;
    if (Object.keys(exif).length > 0) formData.append("exif", JSON.stringify(exif));

    let id = queue.length;
    queue = [...queue, { fileName: images[currImg].newName ?? images[currImg].name.split(".")[0], isProcessing: true, res: data[0], quality: data[1], id: uuidv4() }];
    fetch(`${API}/image`, { method: "POST", body: formData }).then(async (res) => {
      if (res.status === 200) {
        queue[id].isProcessing = false;
        const data = (await res.json()).results[0];
        queue[id].originalSize = data.originalSize;
        queue[id].newSize = data.newSize;
      } else {
        queue[id].isProcessing = false;
        const data = (await res.json()).results[0];
        queue[id].originalSize = data.originalSize;
        queue[id].newSize = "ERROR";
      }
    });
    handleNextImage();
  };

  const onKeyDown = (e) => {
    if (!e.ctrlKey || e.key === "Control") return;
    if (e.key === "ArrowRight") imagesStore.next();
    else if (e.key === "ArrowLeft") imagesStore.prev();
    else if (e.key === "f") {
      e.preventDefault();
      imagesStore.flipImage();
    }
  };

  const handlePrevImage = () => {
    if (currImg <= 0) return;
    currImg--;
    updateNewDate();
    imagesStore.prev();
    orientationOffset = null;
    inputPreset = "";
  };

  const handleNextImage = () => {
    if (currImg + 1 === images.length) return alert("You've reached the end.");
    currImg++;
    updateNewDate();
    imagesStore.next();
    orientationOffset = null;
    inputPreset = "";
  };

  const updateNewDate = () => {
    newDate = {
      year: images[currImg].date.format("YYYY"),
      month: images[currImg].date.format("MM"),
      day: images[currImg].date.format("DD"),
      hour: images[currImg].date.format("HH"),
      minute: images[currImg].date.format("mm"),
      second: images[currImg].date.format("ss"),
    };
  };

  const getClassOrieBtn = (x, y) => {
    return `bg-neutral-950 p-2 rounded shadow ${x == y ? "brightness-50" : ""}`;
  };
</script>

<main class="flex flex-row h-[100dvh]">
  <div class="flex flex-col justify-center items-center flex-grow">
    <div class="flex flex-row justify-between gap-4 w-full p-2">
      <p>{`${($currentImage.size / 1024 ** 2).toFixed(2)}MB`}</p>
      <p>{$currentImage.newName ?? $currentImage.name}</p>
      <p>{`${currImg + 1}/${images.length}`}</p>
    </div>
    <img src={URL.createObjectURL($currentImage)} alt={`image${currImg + 1}`} class="flex-grow object-contain overflow-hidden" />
  </div>

  <Sidebar />
</main>

<svelte:window on:keydown={onKeyDown} />

<style>
</style>
