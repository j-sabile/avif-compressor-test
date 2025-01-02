<script setup lang="ts">
  export let show: boolean;
  export let dialog;
  import { images } from "../../stores/images";

  const handleSave = () => {
    // TODO: save the info to store
    handleCloseModal();
  };

  const handleCloseModal = () => {
    show = false;
    dialog.close();
  };

  const handleFlipClick = () => {
    images.changeOrientationCurrImg("Mirror horizontal");
  };
</script>

<div class="flex flex-col justify-center items-center gap-6 p-4">
  <h2 class="font-medium text-3xl text-start w-full">Edit Orientation</h2>
  <div class="flex flex-col gap-4">
    <button on:click={handleFlipClick}>Flip</button>
  </div>
  <div class="flex flex-row justify-end items-start gap-2 w-full">
    <button class="font-semibold text-lg px-6 py-2 rounded" on:click={handleCloseModal}>Cancel</button>
    <button class="bg-white text-black font-semibold text-lg px-6 py-2 rounded" on:click={handleSave}>Save</button>
  </div>
</div>
