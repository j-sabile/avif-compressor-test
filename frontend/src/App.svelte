<script>
  import Slider from "./components/Slider.svelte";
  let images = [];
  let quality = "40";
  let effort = "6";
  let resolution = "1080";

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

<div class="flex justify-center items-center min-h-[100dvh] p-2">
  <main class="flex flex-row flex-wrap justify-center gap-10 my-auto">
    <!-- UPLOAD SECTION -->
    <section class="flex flex-col justify-center items-center max-w-[250px] max-h-[300px] my-auto">
      <div
        class="drop-area w-full h-[100px] sm:h-[200px]"
        on:dragover={handleDragOver}
        on:drop={handleDrop}
        role="application"
      >
        Drag images here...
      </div>
      <button on:click={handleUpload} class="bg-neutral-900 rounded-lg shadow px-5 py-2 m-4 hover:brightness-90"
        >Upload</button
      >
    </section>

    <!-- IMAGES LIST SECTION -->
    <section class="flex flex-col gap-2 justify-center items-center h-full w-[300px] max-h-[250px]">
      <h3 class="text-center text-lg font-semibold">Images</h3>
      <ul class="flex flex-col gap-2 w-full overflow-auto scroll pe-2">
        {#each images as image, index}
          <li class="flex flex-row justify-between bg-neutral-900 rounded-md shadow w-full px-4 py-1">
            <p>{image.name}</p>
            <button on:click={() => (images = images.filter((_, i) => i !== index))}>&#x2715;</button>
          </li>
        {:else}
          <p class="italic font-thin text-center my-4">No images...</p>
        {/each}
      </ul>
    </section>

    <section class="flex flex-col gap-2">
      <Slider title="Quality" min="1" max="100" bind:value={quality} />
      <Slider title="Effort" min="0" max="9" bind:value={effort} />
      <Slider title="Resolution" min="144" max="3456" bind:value={resolution} />
    </section>
  </main>
</div>

<style>
  .drop-area {
    border: 2px dashed gray;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  /* Customize the scrollbar appearance */
  .scroll::-webkit-scrollbar {
    width: 8px;
  }

  .scroll::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
</style>
