<script>
  export let images;
  import presets from "../data/presets";
  import Slider from "./Slider.svelte";
  import Spinner from "./Spinner.svelte";
  let queue = [];
  let currImg = 0;
  let inputPreset = "";
  let effort = 6;

  const handleEnterPreset = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const selectedPreset = presets[inputPreset];

    if (selectedPreset === undefined) {
      inputPreset = "";
      return alert("No preset for that value.");
    }

    formData.append("resolution", selectedPreset[0]);
    formData.append("quality", selectedPreset[1]);
    formData.append("effort", "1");
    formData.append("img", images[currImg]);
    let id = queue.length;
    queue = [...queue, { fileName: images[currImg].name.replace("_Hyper", "").replace("IMG_", "").split(".")[0], isProcessing: true }];
    fetch("http://localhost:3000/image", { method: "POST", body: formData }).then(async (res) => {
      if (res.status === 200) {
        queue[id].isProcessing = false;
        const data = (await res.json()).results[0];
        queue[id].originalSize = data.originalSize;
        queue[id].newSize = data.newSize;
      }
    });
    inputPreset = "";
    if (currImg + 1 === images.length) return alert("You've reached the end.");
    currImg++;
  };
</script>

<main class="flex flex-row h-[100dvh]">
  <div class="flex flex-col justify-center items-center flex-grow">
    <div class="flex flex-row justify-between gap-4 w-full p-2">
      <p>{`${(images[currImg].size / 1024 ** 2).toFixed(2)}MB`}</p>
      <p>{images[currImg].name}</p>
      <p>{`${currImg + 1}/${images.length}`}</p>
    </div>
    <img src={URL.createObjectURL(images[currImg])} alt={`image${currImg + 1}`} class="flex-grow object-contain overflow-hidden" />
  </div>

  <section class="flex flex-col gap-4 p-2">
    <form class="flex flex-col" on:submit={handleEnterPreset}>
      <label for="preset">Preset</label>
      <input class="text-black rounded outline-none ps-1" type="text" bind:value={inputPreset} id="preset" />
    </form>
    <Slider title="Effort" min="0" max="9" bind:value={effort} />
    <div class="flex flex-row justify-center gap-2 w-full">
      <button class="bg-neutral-900 rounded shadow font-bold px-4 py-1 hover:brightness-90" on:click={() => currImg - 1 >= 0 && currImg--}>{"<"}</button>
      <button class="bg-neutral-900 rounded shadow font-bold px-4 py-1 hover:brightness-90" on:click={() => currImg + 1 < images.length && currImg++}>{">"}</button>
    </div>
    <div class="flex flex-col gap-1">
      {#each queue as item}
        <div class="flex flex-row justify-between items-center bg-neutral-700 rounded shadow px-2 py-1">
          <div class="flex flex-col">
            <h6>
              {item.fileName.length > 15 ? item.fileName.slice(0, 8) + "..." + item.fileName.slice(item.fileName.length - 6) : item.fileName}
            </h6>
            <p>
              {`${item.newSize? (item.originalSize/1024**2).toFixed(2)+"MB - "+(item.newSize/1024**2).toFixed(2)+"MB":"..."}`}
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
  </section>
</main>

<style>
</style>
