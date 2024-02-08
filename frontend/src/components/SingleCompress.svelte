<script>
  export let images;
  import presets from "../data/presets";
  import Slider from "./Slider.svelte";
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
    fetch("http://localhost:3000/image", { method: "POST", body: formData });
    inputPreset = "";
    if (currImg + 1 === images.length) return alert("You've reached the end.");
    currImg++;
  };
</script>

<main class="flex flex-row h-screen">
  <div class="flex flex-col justify-center items-center flex-grow">
    <div class="flex flex-row justify-between gap-4 w-full p-2">
      <p>{`${(images[currImg].size / 1024 ** 2).toFixed(2)}MB`}</p>
      <p>{images[currImg].name}</p>
      <p>{`${currImg + 1}/${images.length}`}</p>
    </div>
    <img src={URL.createObjectURL(images[currImg])} alt={`image${currImg + 1}`} class="flex-grow *:w-full object-contain" />
  </div>

  <section class="flex flex-col gap-4 p-2">
    <form class="flex flex-col" on:submit={handleEnterPreset}>
      <label for="preset">Preset</label>
      <input class="text-black rounded outline-none ps-1" type="text" bind:value={inputPreset} id="preset" />
    </form>
    <Slider title="Effort" min="0" max="9" bind:value={effort} />
    <div class="flex flex-row justify-center gap-2 w-full">
      <button
        class="bg-neutral-900 rounded shadow font-bold px-4 py-1 hover:brightness-90"
        on:click={() => currImg - 1 >= 0 && currImg--}>{"<"}</button
      >
      <button
        class="bg-neutral-900 rounded shadow font-bold px-4 py-1 hover:brightness-90"
        on:click={() => currImg + 1 < images.length && currImg++}>{">"}</button
      >
    </div>
  </section>
</main>

<style>
</style>
