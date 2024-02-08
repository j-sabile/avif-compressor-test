<script>
  export let images;
  import presets from "../data/presets";
  let currImg = 0;
  let inputPreset = "";

  const handleEnterPreset = (e) => {
    e.preventDefault();
    // compress here
    inputPreset = "";
    if (currImg + 1 === images.length) return alert("You've reached the end.");
    currImg++;
  };
</script>

<main class="flex flex-row h-screen">
  <div class="flex justify-center items-center flex-grow">
    <img src={URL.createObjectURL(images[currImg])} alt={`image${currImg + 1}`} class="w-full object-contain" />
  </div>
  <form class="flex flex-col" on:submit={handleEnterPreset}>
    <input class="text-black" type="text" bind:value={inputPreset} />
  </form>
</main>

<style>
</style>
