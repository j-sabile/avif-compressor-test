<script setup lang="ts">
  export let show: boolean;
  export let dialog;
  import { images, currImg } from "../../stores/images";

  let inputValue = {
    model: "",
    make: "",
    iso: "",
    fLength: "",
    shutterSpeed: "",
    aperture: ""
  };

  $: {
    inputValue.make = $currImg.newMake;
    inputValue.model = $currImg.newModel;
    inputValue.iso = String($currImg.newIso);
    inputValue.fLength = String($currImg.newFLength);
    inputValue.shutterSpeed = String($currImg.newShutterSpeed);
    inputValue.aperture = String($currImg.newAperture);
  }

  const handleSave = (e) => {
    e.preventDefault();
    const {make, model, iso, fLength, shutterSpeed, aperture} = inputValue;
    images.changeCameraCurrImg(make, model, Number(iso), Number(fLength), shutterSpeed, Number(aperture));
    handleCloseModal();
  };

  const handleCloseModal = () => {
    show = false;
    dialog.close();
  };

  const handleInputChange = (event: Event, type: string) => {
    inputValue[type] = (event.target as HTMLInputElement).value;
  };
</script>

<form class="flex flex-col justify-center items-center gap-6 p-4" on:submit={handleSave}>
  <h2 class="font-medium text-3xl text-start w-full">Edit Camera</h2>
  <div class="flex flex-row items-center gap-6">
    <div class="flex flex-row items-center gap-2 text-lg w-full">
      <label for="make" class="">Make:</label>
      <input type="text" id="make" value={inputValue.make} on:input={(e) => handleInputChange(e, "make")} class="w-36 px-4 py-1 border-[#DDD] border rounded" />
    </div>
    <div class="flex flex-row items-center gap-2 text-lg w-full">
      <label for="model" class="">Model:</label>
      <input type="text" id="model" value={inputValue.model} on:input={(e) => handleInputChange(e, "model")} class="w-36 px-4 py-1 border-[#DDD] border rounded" />
  </div>
  </div>
  <div class="flex flex-row justify-between w-full">
    <div class="flex flex-row items-center gap-1 text-lg">
      <label for="aperture" class="">ƒ/</label>
      <input type="text" id="aperture" value={inputValue.aperture} on:input={(e) => handleInputChange(e, "aperture")} class="w-12 text-center px-2 py-1 border-[#DDD] border rounded" />
    </div>
    <div class="flex flex-row items-center gap-1 text-lg">
      <label for="shutter" class=""></label>
      <input type="text" id="shutter" value={inputValue.shutterSpeed} on:input={(e) => handleInputChange(e, "shutterSpeed")} class="w-16 text-center px-2 py-1 border-[#DDD] border rounded" />
    </div>
    <div class="flex flex-row items-center gap-1 text-lg">
      <input type="text" id="fLength" value={inputValue.fLength} on:input={(e) => handleInputChange(e, "fLength")} class="w-12 text-center px-2 py-1 border-[#DDD] border rounded" />
      <label for="fLength" class=""> mm</label>
    </div>
    <div class="flex flex-row items-center gap-2 text-lg">
      <label for="iso" class="">ISO:</label>
      <input type="text" id="iso" value={inputValue.iso} on:input={(e) => handleInputChange(e, "iso")} class="w-16 text-center px-2 py-1 border-[#DDD] border rounded" />
    </div>

  </div>
  <div class="flex flex-row justify-end items-start gap-2 w-full">
    <button type="button" class="font-semibold text-lg px-6 py-2 rounded" on:click={handleCloseModal}>Cancel</button>
    <button type="submit" class="bg-white text-black font-semibold text-lg px-6 py-2 rounded" on:click={handleSave}>Save</button>
  </div>
</form>
