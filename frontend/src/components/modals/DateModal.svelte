<script setup lang="ts">
  import moment from "moment";
  export let show: boolean;
  export let dialog;
  import { images, currImg } from "../../stores/images";

  let inputValue = {
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    second: "",
  };

  let inputRefs = [null, null, null, null, null, null];

  $: {
    inputValue.year = $currImg.newDate.format("YYYY");
    inputValue.month = $currImg.newDate.format("MM");
    inputValue.day = $currImg.newDate.format("DD");
    inputValue.hour = $currImg.newDate.format("HH");
    inputValue.minute = $currImg.newDate.format("mm");
    inputValue.second = $currImg.newDate.format("ss");
  }

  const handleSave = (e) => {
    e.preventDefault();
    const { year, month, day, hour, minute, second } = inputValue;
    images.changeDateCurrImg(moment(`${year}-${month}-${day} ${hour}:${minute}:${second}`));
    handleCloseModal();
  };

  const handleCloseModal = () => {
    show = false;
    dialog.close();
  };

  const handleInputChange = (event: Event, type: string, maxInputSize: number, nextInput?: number) => {
    const value = (event.target as HTMLInputElement).value;
    inputValue[type] = value;
    if (nextInput && value.length >= maxInputSize) inputRefs[nextInput].focus();
  };

  const handleFocus = (event: FocusEvent) => {
    (event.target as HTMLInputElement).select();
  };
</script>

<form class="flex flex-col justify-center items-center gap-6 p-4" on:submit={handleSave}>
  <h2 class="font-medium text-3xl text-start w-full">Edit Date</h2>
  <div class="flex flex-col gap-4">
    <p class="text-xl text-start w-full">{$currImg.date.format("MMMM DD, YYYY hh:mm A, dddd")}</p>
    <div class="flex flex-row gap-2 text-xl font-normal">
      <input type="number" placeholder="" class="w-24 ps-6 py-1 border-[#DDD] border rounded" on:input={(e) => handleInputChange(e, "year", 4, 1)} value={inputValue.year} bind:this={inputRefs[0]} on:focus={handleFocus} />
      <input type="number" placeholder="" class="w-20 ps-7 py-1 border-[#DDD] border rounded" on:input={(e) => handleInputChange(e, "month", 2, 2)} value={inputValue.month} bind:this={inputRefs[1]} on:focus={handleFocus} />
      <input type="number" placeholder="" class="w-20 ps-7 py-1 border-[#DDD] border rounded me-2" on:input={(e) => handleInputChange(e, "day", 2, 3)} value={inputValue.day} bind:this={inputRefs[2]} on:focus={handleFocus} />
      <input type="number" placeholder="" class="w-20 ps-7 py-1 border-[#DDD] border rounded" on:input={(e) => handleInputChange(e, "hour", 2, 4)} value={inputValue.hour} bind:this={inputRefs[3]} on:focus={handleFocus} />
      <input type="number" placeholder="" class="w-20 ps-7 py-1 border-[#DDD] border rounded" on:input={(e) => handleInputChange(e, "minute", 2, 5)} value={inputValue.minute} bind:this={inputRefs[4]} on:focus={handleFocus} />
      <input type="number" placeholder="" class="w-20 ps-7 py-1 border-[#DDD] border rounded" on:input={(e) => handleInputChange(e, "second", 2)} value={inputValue.second} bind:this={inputRefs[5]} on:focus={handleFocus} />
    </div>
  </div>
  <div class="flex flex-row justify-end items-start gap-2 w-full">
    <button type="button" class="font-semibold text-lg px-6 py-2 rounded" on:click={handleCloseModal}>Cancel</button>
    <button type="submit" class="bg-white text-black font-semibold text-lg px-6 py-2 rounded" on:click={handleSave}>Save</button>
  </div>
</form>
