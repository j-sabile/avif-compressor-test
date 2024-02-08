<script>
  import Slider from "./components/Slider.svelte";
  let images = [];
  let quality = "40";
  let effort = "6";

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("quality", quality);
    formData.append("effort", effort);
    images.forEach((img) => formData.append("img", img));

    const res = await fetch("http://localhost:3000/image", {
      method: "POST",
      body: formData,
    });
    await res.json();
    alert("Success!");
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();

    const fileList = e.dataTransfer.files;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = file.name.split(".").pop().toLowerCase();

      if (["jpg", "webp", "jpeg", "png"].includes(extension)) {
        images = [...images, file];
      }
    }
  };
</script>

<main class="flex flex-col justify-center items-center my-auto min-h-[100dvh]">
  <div class="drop-area" on:dragover={handleDragOver} on:drop={handleDrop} role="application">Drag images here...</div>
  <button on:click={handleUpload} class="bg-neutral-900 rounded-lg shadow px-5 py-2 m-4 hover:brightness-90">Upload</button>

  <section class="flex flex-col gap-2">
    <Slider title="Quality" min="1" max="100" bind:value={quality} />
    <Slider title="Effort" min="0" max="9" bind:value={effort} />
  </section>

  <h3 class="text-center text-lg font-semibold my-4">Images</h3>
  <ul class="flex flex-col gap-2">
    {#each images as image}
      <li class="bg-neutral-900 rounded shadow px-4 py-1">{image.name}</li>
    {:else}
      <p class="italic font-thin my-4">No images...</p>
    {/each}
  </ul>
</main>

<style>
  .drop-area {
    border: 2px dashed gray;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    height: 250px;
    width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
