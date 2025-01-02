<script setup lang="ts">
  export let show: boolean;
  import Pencil from "../svg/Pencil.svelte";
</script>

<button class="flex flex-row items-center justify-between w-full gap-2" on:click={() => (show = true)}>
  <div class="flex flex-row items-center justify-start gap-4 w-full">
    <slot name="icon" />
    <div class="flex flex-col items-start text-lg w-full">
      <p class=" text-start"><slot name="title" /></p>
      <p class="text-[#DDD] text-start"><slot name="subtitle" /></p>
    </div>
    <slot />
  </div>
  <Pencil size={25} color="#444" />
</button>
