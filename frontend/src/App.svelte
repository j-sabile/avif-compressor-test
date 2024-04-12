<script>
  import { io } from "socket.io-client";

  import Slider from "./components/Slider.svelte";
  import SingleCompress from "./components/SingleCompress.svelte";
  import Modal from "./components/Modal.svelte";

  let images = [];
  let quality = "40";
  let effort = "6";
  let resolution = "1080";
  let isCompressing = false;
  let isSingleCompress = false;
  let connected = true;
  let canDownload = false;
  let showModal = false;

  // const socket = io(import.meta.env.VITE_API);
  // socket.on("compressed", (t) => console.log(t + " received"));
  // socket.on("connect", () => (connected = true));

  const handleCompress = async () => {
    isCompressing = true;
    const formData = new FormData();
    formData.append("quality", quality);
    formData.append("effort", effort);
    formData.append("resolution", resolution);
    // formData.append("socketId", socket.id);
    images.forEach((img) => formData.append("img", img));

    const res = await fetch(`${import.meta.env.VITE_API}/image`, {
      method: "POST",
      body: formData,
    });
    if (res.status == 200) canDownload = true;
    alert("Success!");
    isCompressing = false;
  };

  const handleAddImage = (e) => {
    e.preventDefault();

    const fileList = e.target.files;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = file.name.split(".").pop().toLowerCase();

      if (["jpg", "webp", "jpeg", "png", "avif"].includes(extension)) {
        images = [...images, file];
      }
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();

    const fileList = e.dataTransfer.files;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = file.name.split(".").pop().toLowerCase();

      if (["jpg", "webp", "jpeg", "png", "avif"].includes(extension)) {
        images = [...images, file];
      }
    }
  };

  const handleDownload = async () => {
    fetch(`${import.meta.env.VITE_API}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ socketId: socket.id }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "photos.zip"); // File name
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Download error:", error));
  };

  const handleSortClick = () => {
    images = images.sort((a, b) => a.name.localeCompare(b.name));
  };
</script>

{#if isSingleCompress}
  <SingleCompress {images} />
{:else}
  <div class="flex justify-center items-center min-h-[100dvh] p-2">
    <main class="flex flex-row flex-wrap justify-center gap-10 my-auto">
      <!-- UPLOAD SECTION -->
      <section class="flex flex-col justify-center items-center gap-6 max-w-[250px] max-h-[450px] my-auto">
        <div class="drop-area w-full h-[100px] sm:h-[200px]" on:dragover={handleDragOver} on:drop={handleDrop} role="application">Drag images here...</div>
        <input type="file" multiple on:change={handleAddImage} />
        <div class="flex flex-col justify-center items-center gap-2">
          <button
            on:click={handleCompress}
            class={`bg-neutral-900 rounded-lg shadow px-5 py-2 ${images.length === 0 || isCompressing || !connected ? "brightness-75" : "hover:brightness-90"}`}
            disabled={images.length === 0 || isCompressing || !connected}>{isCompressing ? `Compressing...` : "Compress"}</button
          >
          <button on:click={() => (isSingleCompress = true)} class={`bg-neutral-900 rounded-lg shadow px-5 py-2 ${images.length === 0 ? "brightness-75" : "hover:brightness-90"}`} disabled={images.length === 0}>Single Compress</button>
          <button on:click={() => (showModal = true)} class={`bg-neutral-900 rounded-lg shadow px-5 py-2 ${images.length === 0 || isCompressing ? "brightness-75" : "hover:brightness-90"}`} disabled={images.length === 0 || isCompressing}
            >Batch EXIF</button
          >
          <!-- <button on:click={() => (isSingleCompress = true)} class={`bg-neutral-900 rounded-lg shadow px-5 py-2 ${images.length === 0 ? "brightness-75" : "hover:brightness-90"}`} disabled={images.length === 0}>Single Compress</button> -->
        </div>
      </section>

      <!-- IMAGES LIST SECTION -->
      <section class="flex flex-col gap-4 justify-between items-center w-[300px] h-[250px]">
        <div class="flex flex-col gap-2 h-full justify-start items-center w-full">
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
        </div>
        <button class="bg-neutral-900 rounded-lg shadow px-5 py-2 hover:brightness-90" on:click={handleSortClick}>SORT</button>
        {#if canDownload}
          <button on:click={handleDownload} class={`bg-neutral-900 rounded-lg shadow px-5 py-2 ${images.length === 0 ? "brightness-75" : "hover:brightness-90"}`}>Download</button>
        {/if}
        <!-- disabled={images.length === 0} -->
      </section>

      <!-- SETTINGS SECTION -->
      <section class="flex flex-col gap-2">
        <Slider title="Quality" min="1" max="100" bind:value={quality} />
        <Slider title="Effort" min="0" max="9" bind:value={effort} />
        <Slider title="Resolution" min="144" max="3456" bind:value={resolution} />
      </section>
    </main>
    <Modal bind:showModal {images} />
  </div>
{/if}

<style>
  button:disabled {
    cursor: not-allowed;
  }

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
