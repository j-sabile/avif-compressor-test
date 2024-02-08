<script>
  const handleAddFile = async (e) => {
    const image = e.target.files[0];
    console.log(image);

    const formData = new FormData();
    formData.append("img", image);
    const res = await fetch("http://localhost:3000/image", {
      method: "POST",
      body: formData,
    });
    console.log(await res.json());
  };
</script>

<main>
  <input type="file" on:change={handleAddFile} />
</main>

<style>
</style>
