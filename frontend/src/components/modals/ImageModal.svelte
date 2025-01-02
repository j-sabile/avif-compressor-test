<script setup lang="ts">
  export let show: boolean;
  export let dialog;
  import { images, currImg } from "../../stores/images";

  let inputValue = $currImg.newName;

  $: {
    inputValue = $currImg.newName;
  }

  const handleSave = (e) => {
    e.preventDefault();
    images.changeNameCurrImg(inputValue);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    show = false;
    dialog.close();
  };

  const handleInputChange = (event: Event) => {
    inputValue = (event.target as HTMLInputElement).value;
  };
</script>

<form class="flex flex-col justify-center items-center gap-6 p-4" on:submit={handleSave}>
  <h2 class="font-medium text-3xl text-start w-full">Edit Image</h2>
  <div class="flex flex-row items-center gap-4 text-lg w-full">
    <label for="filename" class="">Filename:</label>
    <input type="text" id="filename" value={inputValue} on:input={handleInputChange} class="w-72 px-4 py-1 border-[#DDD] border rounded" />
  </div>
  <div class="flex flex-row justify-end items-start gap-2 w-full">
    <button type="button" class="font-semibold text-lg px-6 py-2 rounded" on:click={handleCloseModal}>Cancel</button>
    <button type="submit" class="bg-white text-black font-semibold text-lg px-6 py-2 rounded" on:click={handleSave}>Save</button>
  </div>
</form>
