<script>
  let images = [];

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((img) => formData.append("img", img));

    const res = await fetch("http://localhost:3000/image", {
      method: "POST",
      body: formData,
    });
    console.log(await res.json());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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

<main>
  <div class="drop-area" on:dragover={handleDragOver} on:drop={handleDrop} role="application">Drag images here...</div>
  <button on:click={handleUpload}>Upload</button>
  <h3>Files</h3>
  <ul>
    {#each images as image}
      <li>{image.name}</li>
    {:else}
      <li>No images added</li>
    {/each}
  </ul>
</main>

<style>
  .drop-area {
    margin: 1rem;
    border: 2px dashed gray;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    height: 200px;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
