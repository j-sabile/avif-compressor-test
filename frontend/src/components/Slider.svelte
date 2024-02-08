<script>
  export let title;
  export let min;
  export let max;
  export let value;
</script>

<div class="flex flex-col gap-1 mb-2">
  <div class="flex gap-1 justify-between">
    <h6>{title}</h6>
    <input class="rounded text-black max-w-12 ps-1" type="number" bind:value />
  </div>
  <input type="range" {min} {max} bind:value class="slider" id="myRange" />
</div>

<style>
  .slider {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 2rem;
    width: 100%;
    height: 0.75rem;
    background: #aaa;
    outline: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 1rem;
    width: 1rem;
    height: 1rem;
    background: #111;
    cursor: pointer;
  }
</style>
