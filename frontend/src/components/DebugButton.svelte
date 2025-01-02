<script setup lang="ts">
  import { images as imagesStore, currImg, lat as latStore, lng as lngStore } from "../stores/images";

  const handleClick = () => {
    console.log("images", $imagesStore);
    console.log("currImg", $currImg);
  };
</script>

<button on:click={handleClick}> Debug! </button>
