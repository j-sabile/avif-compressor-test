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
  <!-- <section class="flex flex-col gap-4 p-2 min-w-[250px]">
    <form class="flex flex-col" on:submit={handleEnterPreset}>
      <label for="preset">Preset</label>
      <input class="text-white rounded outline-none ps-1" type="text" placeholder="Enter preset" bind:value={inputPreset} id="preset" />
    </form>
    <DebugButton />
    <Slider title="Effort" min="0" max="9" bind:value={effort} />
    <div class="flex flex-row justify-center gap-2 w-full">
      <button class={getClassOrieBtn(-1, orientationOffset)} on:click={() => (orientationOffset = -1)}><RotateCcw size="28px" /></button>
      <button class={getClassOrieBtn(2, orientationOffset)} on:click={() => (orientationOffset = 2)}>180 </button>
      <button class={getClassOrieBtn(1, orientationOffset)} on:click={() => (orientationOffset = 1)}><RotateCw size="28px" /></button>
      <button class={getClassOrieBtn("mirror", orientationOffset)} on:click={() => (orientationOffset = "mirror")}><MirrorHorizontally size="28px" /></button>
    </div>
    <div class="flex flex-row justify-center gap-2 w-full">
      <button on:click={handlePrevImage}> <Prev /> </button>
      <button on:click={handleNextImage}> <Next /> </button>
    </div>
    {#if $currentImage.date.isValid()}
      <div class="flex flex-col justify-center items-center w-full">
        <p>{$currentImage.date.format("MMM D, YYYY - dddd")}</p>
        <p>{$currentImage.date.format("HH:mm:ss")}</p>
      </div>
    {:else}
      <p class="text-center">No Date</p>
    {/if}
    <div>
      <input type="number" bind:value={newDate.year} min="1970" max="2025" />
      <input type="number" bind:value={newDate.month} min="1" max="12" />
      <input type="number" bind:value={newDate.day} min="1" max="31" />
    </div>
    <div>
      <input type="number" bind:value={newDate.hour} min="0" max="23" />
      <input type="number" bind:value={newDate.minute} min="0" max="59" />
      <input type="number" bind:value={newDate.second} min="0" max="59" />
    </div>
    <Map />

    <div class="flex flex-col gap-1 overflow-y-auto">
      {#each queue.toReversed() as item (item.id)}
        <div class="flex flex-row justify-between items-center gap-2 bg-neutral-700 rounded shadow px-2 py-1" in:fly={{ y: -100, duration: 150 }}>
          <div class="flex flex-col justify-center items-center text-xs font-thin italic">
            <p>{item.res}p</p>
            <p>{item.quality}</p>
          </div>
          <div class="flex flex-col">
            <h6>
              {item.fileName.length > 15 ? item.fileName.slice(0, 8) + "..." + item.fileName.slice(item.fileName.length - 6) : item.fileName}
            </h6>
            <p class="text-sm text-center">
              {`${item.newSize ? (item.originalSize / 1024 ** 2).toFixed(2) + "MB - " + (item.newSize / 1024 ** 2).toFixed(2) + "MB" : " - "}`}
            </p>
          </div>
          {#if item.isProcessing}
            <Spinner />
          {:else}
            <div class="font-bold text-green-500">✓</div>
          {/if}
        </div>
      {/each}
    </div>
  </section> -->
</main>

<svelte:window on:keydown={onKeyDown} />

<style>
</style>
