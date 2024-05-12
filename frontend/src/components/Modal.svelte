<script>
  export let showModal; // boolean

  let dialog; // HTMLDialogElement
  let isEditing = false;
  export let brand = "";
  export let model = "";

  $: if (dialog && showModal) dialog.showModal();
  const orie = ["Horizontal (normal)", "Rotate 90 CW", "Rotate 180", "Rotate 270 CW", "Mirror horizontal", "Mirror vertical", "Mirror horizontal and rotate 270 CW", "Mirror horizontal and rotate 90 CW"];
  const handleEdit = async (e) => {
    e.stopPropagation();
    dialog.close();
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog class="bg-neutral-800" bind:this={dialog} on:close={() => (showModal = false)} on:click|self={() => dialog.close()}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <form on:submit={handleEdit}>
      <h2 class="text-white text-lg font-semibold text-center my-2">Edit Make and Camera Model Name</h2>
      <input type="text" placeholder="Brand" bind:value={brand} class="text-black rounded outline-none px-2 py-1 my-2" />
      <input type="text" placeholder="Model" bind:value={model} class="text-black rounded outline-none px-2 py-1 my-2" />
      <div class="flex flex-row gap-4 justify-end mt-4">
        <button type="button" on:click={() => dialog.close()} class="text-white border-2 rounded-lg px-5 py-2 border-neutral-900">Close</button>
        <button type="button" on:click={handleEdit} class={`bg-neutral-900 rounded-lg shadow px-5 py-2 text-white ${isEditing ? "brightness-75" : "hover:brightness-90"}`} disabled={isEditing}>{isEditing ? "Editing..." : "Edit"}</button>
      </div>
    </form>
  </div>
</dialog>

<style>
  dialog {
    max-width: 32em;
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  button {
    display: block;
  }
</style>
